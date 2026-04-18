import { useState, useEffect, useRef } from 'react';
import { Upload, Edit2, Trash2, Eye, EyeOff, MoveUp, MoveDown, X } from 'lucide-react';
import { useToast } from './ToastContext';
import './GalleryManagement.css';

export default function GalleryManagement() {
    const { addToast } = useToast();
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        image_base64: '',
        display_order: 0,
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:5000';

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/admin/gallery`);
            if (!res.ok) throw new Error('Failed to fetch gallery');
            const data = await res.json();
            setImages(data);
        } catch (error) {
            addToast(`Error loading gallery: ${error.message}`, 'error');
        }
    };

    const SUPPORTED_TYPES = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
        'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff', 'image/avif'
    ];
    const MAX_FILE_SIZE_MB = 5;
    const MAX_BATCH_UPLOAD_SIZE = 50; // Maximum 50 images per batch

    const handleFileChange = (e) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (files.length === 0) return;

        const validFiles = [];
        const errors = [];

        files.forEach((file, index) => {
            // Reject HEIC/HEIF
            if (file.type === 'image/heic' || file.type === 'image/heif' ||
                file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
                errors.push(`File ${index + 1} (${file.name}): HEIC/HEIF format not supported by browsers.`);
                return;
            }

            // Reject unsupported types
            if (!SUPPORTED_TYPES.includes(file.type)) {
                errors.push(`File ${index + 1} (${file.name}): Unsupported format ${file.type || 'unknown'}.`);
                return;
            }

            // Reject files over size limit
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                errors.push(`File ${index + 1} (${file.name}): Too large (${(file.size / 1024 / 1024).toFixed(1)} MB), max ${MAX_FILE_SIZE_MB} MB.`);
                return;
            }

            validFiles.push(file);
        });

        if (validFiles.length === 0) {
            errors.forEach(err => addToast(err, 'error'));
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        if (validFiles.length > MAX_BATCH_UPLOAD_SIZE) {
            addToast(`Too many files. Maximum ${MAX_BATCH_UPLOAD_SIZE} files per upload.`, 'error');
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        if (errors.length > 0) {
            errors.forEach(err => addToast(err, 'warning'));
        }

        // Convert files to base64
        let loadedCount = 0;
        const processedFiles = [];

        validFiles.forEach((file, idx) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                processedFiles.push({
                    id: Date.now() + idx,
                    file: file,
                    base64: event.target.result,
                    title: file.name.split('.')[0], // Use filename as default title
                    description: '',
                    size: file.size,
                });
                loadedCount++;

                if (loadedCount === validFiles.length) {
                    setSelectedFiles(prev => [...prev, ...processedFiles]);
                    addToast(`${validFiles.length} image(s) selected for upload`, 'success');
                }
            };
            reader.onerror = () => {
                errors.push(`File ${idx + 1} (${file.name}): Failed to read.`);
                loadedCount++;
                if (loadedCount === validFiles.length && processedFiles.length > 0) {
                    setSelectedFiles(prev => [...prev, ...processedFiles]);
                }
            };
            reader.readAsDataURL(file);
        });

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'display_order' ? (parseInt(value) || 0) : value
        }));
    };

    const handleFileMetadataChange = (fileId, field, value) => {
        setSelectedFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, [field]: value } : f
        ));
    };

    const removeSelectedFile = (fileId) => {
        setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
    };

    const clearAllSelectedFiles = () => {
        setSelectedFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const uploadBatch = async () => {
        if (selectedFiles.length === 0) {
            addToast('No files selected for upload', 'error');
            return;
        }

        // Validate all files have titles
        const filesWithoutTitles = selectedFiles.filter(f => !f.title.trim());
        if (filesWithoutTitles.length > 0) {
            addToast('All images must have a title', 'error');
            return;
        }

        setLoading(true);
        try {
            const payloads = selectedFiles.map((f, idx) => ({
                title: f.title.trim(),
                description: f.description.trim(),
                image_base64: f.base64,
                image_url: '',
                display_order: selectedFiles.length - idx - 1, // Reverse so first file is at top
            }));

            // Send each image as a separate request (can be optimized to batch if backend supports)
            let successCount = 0;
            let failedCount = 0;

            for (let i = 0; i < payloads.length; i++) {
                try {
                    const res = await fetch(`${API_BASE}/api/admin/gallery`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payloads[i])
                    });

                    if (!res.ok) {
                        const errorData = await res.json().catch(() => null);
                        throw new Error(errorData?.message || 'Failed to save image');
                    }

                    successCount++;
                    setUploadProgress(Math.round(((i + 1) / payloads.length) * 100));
                } catch (error) {
                    failedCount++;
                    console.error(`Error uploading image ${i + 1}:`, error);
                }
            }

            if (successCount > 0) {
                addToast(`Successfully uploaded ${successCount} image(s)${failedCount > 0 ? ` (${failedCount} failed)` : ''}`, successCount === payloads.length ? 'success' : 'warning');
                clearAllSelectedFiles();
                setUploadProgress(0);
                fetchGallery();
            } else {
                addToast(`Failed to upload all ${payloads.length} images`, 'error');
            }
        } catch (error) {
            addToast(`Upload error: ${error.message}`, 'error');
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', image_url: '', image_base64: '', display_order: 0 });
        setEditingId(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || (!formData.image_url && !formData.image_base64)) {
            addToast('Title and either image URL or file upload are required', 'error');
            return;
        }

        setLoading(true);
        try {
            const url = editingId ? `${API_BASE}/api/admin/gallery/${editingId}` : `${API_BASE}/api/admin/gallery`;
            const method = editingId ? 'PUT' : 'POST';

            // BUG FIX 1: Send only one image source — prefer base64 upload over URL, never send both
            const payload = {
                title: formData.title,
                description: formData.description,
                display_order: formData.display_order,
                ...(formData.image_base64
                    ? { image_base64: formData.image_base64, image_url: '' }
                    : { image_url: formData.image_url.trim(), image_base64: null }
                ),
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to save gallery image');
            }

            addToast(editingId ? 'Gallery image updated' : 'Gallery image added', 'success');
            resetForm();
            fetchGallery();
        } catch (error) {
            addToast(`Error: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (image) => {
        setFormData({
            title: image.title,
            description: image.description || '',
            image_url: image.image_url || '',
            display_order: image.display_order || 0,
            image_base64: image.image_base64 || ''
        });
        setEditingId(image.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this image?')) return;

        try {
            const res = await fetch(`${API_BASE}/api/admin/gallery/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
            addToast('Gallery image deleted', 'success');
            fetchGallery();
        } catch (error) {
            addToast(`Error: ${error.message}`, 'error');
        }
    };

    const handleToggleVisibility = async (id, currentVis) => {
        try {
            const res = await fetch(`${API_BASE}/api/admin/gallery/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_visible: !currentVis })
            });
            if (!res.ok) throw new Error('Failed to update visibility');
            addToast(currentVis ? 'Image hidden' : 'Image shown', 'success');
            fetchGallery();
        } catch (error) {
            addToast(`Error: ${error.message}`, 'error');
        }
    };

    const handleReorder = async (id, direction) => {
        const img = images.find(i => i.id === id);
        if (!img) return;

        let newOrder = img.display_order + (direction === 'up' ? -1 : 1);
        newOrder = Math.max(0, newOrder);

        try {
            const res = await fetch(`${API_BASE}/api/admin/gallery/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ display_order: newOrder })
            });
            if (!res.ok) throw new Error('Failed to reorder');
            addToast('Gallery reordered', 'success');
            fetchGallery();
        } catch (error) {
            addToast(`Error: ${error.message}`, 'error');
        }
    };

    // Returns the correct src for an image — prefers base64 upload over URL
    // This fixes PNG and all uploaded formats not showing in the gallery card preview
    const getImageSrc = (image) => {
        if (image.image_base64) return image.image_base64;
        if (image.image_url) return image.image_url;
        return '';
    };

    return (
        <div className="gallery-management">
            <div className="gallery-section-header">
                <h2>🖼️ Gallery Management</h2>
                <p>Manage gallery images that appear on the public website</p>
            </div>

            {/* Batch Upload Section */}
            <div className="gallery-batch-section">
                <h3>Batch Upload Multiple Images - Recommended!</h3>
                <p className="batch-description">Upload multiple images at once with automatic metadata (title from filename). Maximum {MAX_BATCH_UPLOAD_SIZE} images per batch, {MAX_FILE_SIZE_MB} MB each.</p>
                
                <div className="batch-upload-area">
                    <div className="batch-file-input-wrapper">
                        <label htmlFor="fileInputBatch" className="batch-file-label">
                            <Upload size={32} />
                            <p>Click to select images or drag&drop</p>
                            <small>JPG, PNG, GIF, WEBP, SVG, BMP, TIFF, AVIF</small>
                        </label>
                        <input
                            id="fileInputBatch"
                            type="file"
                            multiple
                            accept=".jpg,.jpeg,.png,.gif,.webp,.svg,.bmp,.tiff,.tif,.avif"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className="hidden-file-input"
                        />
                    </div>
                </div>

                {selectedFiles.length > 0 && (
                    <div className="batch-preview-section">
                        <div className="batch-header">
                            <h4>Selected Images ({selectedFiles.length})</h4>
                            <button
                                type="button"
                                onClick={clearAllSelectedFiles}
                                className="btn-secondary-small"
                            >
                                Clear All
                            </button>
                        </div>

                        {uploadProgress > 0 && (
                            <div className="upload-progress">
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                                <span className="progress-text">{uploadProgress}%</span>
                            </div>
                        )}

                        <div className="batch-preview-list">
                            {selectedFiles.map((file) => (
                                <div key={file.id} className="batch-preview-item">
                                    <div className="preview-image">
                                        <img src={file.base64} alt={file.title} />
                                    </div>
                                    <div className="preview-inputs">
                                        <input
                                            type="text"
                                            value={file.title}
                                            onChange={(e) => handleFileMetadataChange(file.id, 'title', e.target.value)}
                                            placeholder="Image title"
                                            maxLength="255"
                                            className="preview-input-title"
                                        />
                                        <textarea
                                            value={file.description}
                                            onChange={(e) => handleFileMetadataChange(file.id, 'description', e.target.value)}
                                            placeholder="Description (optional)"
                                            rows="2"
                                            className="preview-input-desc"
                                        />
                                        <small className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</small>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeSelectedFile(file.id)}
                                        className="btn-remove-file"
                                        title="Remove this file"
                                    >
                                        <X size={20} />
                                        <span className="btn-text-small">Remove</span>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="batch-actions">
                            <button
                                onClick={uploadBatch}
                                disabled={loading}
                                className="btn-primary-large"
                            >
                                {loading ? `Uploading... ${uploadProgress}%` : `Upload All ${selectedFiles.length} Image(s)`}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Gallery List */}
            <div className="gallery-list-section">
                <h3>Gallery Images ({images.length})</h3>
                {images.length === 0 ? (
                    <p className="empty-state">No images yet. Add images using the sections above!</p>
                ) : (
                    <div className="gallery-grid">
                        {images.map((image) => (
                            <div key={image.id} className="gallery-card">
                                <div className="gallery-card-image">
                                    <img src={getImageSrc(image)} alt={image.title} />
                                    <div className="image-overlay">
                                        <span className={`visibility-badge ${image.is_visible ? 'visible' : 'hidden'}`}>
                                            {image.is_visible ? 'Public' : 'Hidden'}
                                        </span>
                                    </div>
                                </div>
                                <div className="gallery-card-content">
                                    <h4>{image.title}</h4>
                                    {image.description && <p>{image.description}</p>}
                                    <p className="order-info">Order: {image.display_order}</p>
                                </div>
                                <div className="gallery-card-actions">
                                    <button
                                        onClick={() => handleToggleVisibility(image.id, image.is_visible)}
                                        title={image.is_visible ? 'Hide' : 'Show'}
                                        className="btn-icon"
                                    >
                                        {image.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                                        <span className="btn-text">{image.is_visible ? 'Show' : 'Hide'}</span>
                                    </button>
                                    <button
                                        onClick={() => handleReorder(image.id, 'up')}
                                        title="Move up"
                                        className="btn-icon"
                                    >
                                        <MoveUp size={18} />
                                        <span className="btn-text">↑</span>
                                    </button>
                                    <button
                                        onClick={() => handleReorder(image.id, 'down')}
                                        title="Move down"
                                        className="btn-icon"
                                    >
                                        <MoveDown size={18} />
                                        <span className="btn-text">↓</span>
                                    </button>
                                    <button
                                        onClick={() => handleEdit(image)}
                                        className="btn-icon edit"
                                        title="Edit image"
                                    >
                                        <Edit2 size={18} />
                                        <span className="btn-text">Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(image.id)}
                                        className="btn-icon delete"
                                        title="Delete image"
                                    >
                                        <Trash2 size={18} />
                                        <span className="btn-text">Delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}