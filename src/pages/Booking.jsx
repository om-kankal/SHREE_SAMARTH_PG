import { useState } from 'react';
import { useToast } from '../components/ToastContext';
import './Booking.css';

// Initial state for 6 rooms, 4 beds each
const initialRooms = Array.from({ length: 6 }, (_, roomIndex) => ({
    id: `R${roomIndex + 1}`,
    beds: Array.from({ length: 4 }, (_, bedIndex) => ({
        id: `R${roomIndex + 1}-B${bedIndex + 1}`,
        status: Math.random() > 0.7 ? 'booked' : 'available', // randomly book some
    })),
}));

export default function Booking() {
    const [rooms, setRooms] = useState(initialRooms);
    const [selectedBeds, setSelectedBeds] = useState([]);
    const { addToast } = useToast();

    const handleBedClick = (bed) => {
        if (bed.status === 'booked') {
            addToast('This bed is already booked.', 'error');
            return;
        }

        if (selectedBeds.includes(bed.id)) {
            // Deselect
            setSelectedBeds(prev => prev.filter(id => id !== bed.id));
        } else {
            // Select
            setSelectedBeds(prev => [...prev, bed.id]);
        }
    };

    const getBedColor = (bedId, status) => {
        if (status === 'booked') return 'var(--error)';
        if (selectedBeds.includes(bedId)) return 'var(--selected)';
        return 'var(--success)';
    };

    const handleAddRoom = () => {
        const newRoomId = `R${rooms.length + 1}`;
        const newRoom = {
            id: newRoomId,
            beds: Array.from({ length: 4 }, (_, bedIndex) => ({
                id: `${newRoomId}-B${bedIndex + 1}`,
                status: 'available',
            })),
        };
        setRooms([...rooms, newRoom]);
        addToast(`Added new room: ${newRoomId}`, 'success');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedBeds.length === 0) {
            addToast('Please select at least one bed to book.', 'warning');
            return;
        }
        // Mock submission
        addToast(`Successfully booked beds: ${selectedBeds.join(', ')}`, 'success');

        // Update local state to booked
        setRooms(prevRooms => prevRooms.map(room => ({
            ...room,
            beds: room.beds.map(bed => ({
                ...bed,
                status: selectedBeds.includes(bed.id) ? 'booked' : bed.status
            }))
        })));
        setSelectedBeds([]);
    };

    return (
        <div className="section container animate-fade-in booking-page">
            <h1 className="heading-1 text-center">Book Your Bed</h1>
            <p className="text-center text-muted facilities-subtitle">
                Select from the available beds below.
            </p>

            <div className="legend-container card">
                <div className="legend-item">
                    <span className="legend-color available"></span> Available
                </div>
                <div className="legend-item">
                    <span className="legend-color selected"></span> Selected
                </div>
                <div className="legend-item">
                    <span className="legend-color booked"></span> Booked
                </div>
            </div>

            <div className="rooms-grid">
                {rooms.map(room => (
                    <div key={room.id} className="card room-card">
                        <h3 className="heading-3 text-center">Room {room.id}</h3>
                        <svg viewBox="0 0 200 200" className="room-svg">
                            {/* Room Outline */}
                            <rect x="10" y="10" width="180" height="180" rx="8" fill="none" stroke="var(--border-color)" strokeWidth="4" />

                            {/* Door */}
                            <rect x="80" y="190" width="40" height="10" fill="var(--bg-color)" />

                            {/* Beds */}
                            {/* Bed 1: Top Left */}
                            <g onClick={() => handleBedClick(room.beds[0])} className={room.beds[0].status === 'booked' ? 'bed-booked' : 'bed-interactive'}>
                                <rect x="20" y="20" width="60" height="70" rx="4" fill={getBedColor(room.beds[0].id, room.beds[0].status)} className="bed-rect" />
                                <rect x="30" y="30" width="40" height="20" rx="2" fill="rgba(255,255,255,0.3)" />
                                <text x="50" y="60" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">{room.beds[0].id}</text>
                            </g>

                            {/* Bed 2: Top Right */}
                            <g onClick={() => handleBedClick(room.beds[1])} className={room.beds[1].status === 'booked' ? 'bed-booked' : 'bed-interactive'}>
                                <rect x="120" y="20" width="60" height="70" rx="4" fill={getBedColor(room.beds[1].id, room.beds[1].status)} className="bed-rect" />
                                <rect x="130" y="30" width="40" height="20" rx="2" fill="rgba(255,255,255,0.3)" />
                                <text x="150" y="60" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">{room.beds[1].id}</text>
                            </g>

                            {/* Bed 3: Bottom Left */}
                            <g onClick={() => handleBedClick(room.beds[2])} className={room.beds[2].status === 'booked' ? 'bed-booked' : 'bed-interactive'}>
                                <rect x="20" y="110" width="60" height="70" rx="4" fill={getBedColor(room.beds[2].id, room.beds[2].status)} className="bed-rect" />
                                <rect x="30" y="150" width="40" height="20" rx="2" fill="rgba(255,255,255,0.3)" />
                                <text x="50" y="140" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">{room.beds[2].id}</text>
                            </g>

                            {/* Bed 4: Bottom Right */}
                            <g onClick={() => handleBedClick(room.beds[3])} className={room.beds[3].status === 'booked' ? 'bed-booked' : 'bed-interactive'}>
                                <rect x="120" y="110" width="60" height="70" rx="4" fill={getBedColor(room.beds[3].id, room.beds[3].status)} className="bed-rect" />
                                <rect x="130" y="150" width="40" height="20" rx="2" fill="rgba(255,255,255,0.3)" />
                                <text x="150" y="140" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">{room.beds[3].id}</text>
                            </g>

                        </svg>
                    </div>
                ))}
            </div>

            <div className="booking-actions">
                <button className="btn btn-secondary" onClick={handleAddRoom}>Add Room to PG</button>
                <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={selectedBeds.length === 0}>
                    Confirm Booking ({selectedBeds.length} beds)
                </button>
            </div>
        </div>
    );
}
