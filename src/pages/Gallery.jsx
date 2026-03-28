import { Star } from 'lucide-react';
import './Gallery.css';

export default function Gallery() {
    const blocks = [
        { type: 'image', id: 1, src: 'https://images.unsplash.com/photo-1522771731470-ea814e82001d?auto=format&fit=crop&q=80', alt: 'Premium Room' },
        {
            type: 'text',
            id: 2,
            title: 'Premium Amenities & Security',
            content: 'Shree Samarth PG offers exceptional living with high-speed Wi-Fi, daily housekeeping, 24/7 security, and hygienic food. It feels just like a home away from home.',
            author: 'Aditya Sharma',
            rating: 5
        },
        { type: 'image', id: 3, src: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80', alt: 'Dining Area' },
        {
            type: 'text',
            id: 4,
            title: 'Perfect Location for Students',
            content: 'The location is incredibly convenient, right near major colleges and transport hubs. The quiet environment makes it perfectly suited for students who need to focus on their studies.',
            author: 'Rahul Patil',
            rating: 5
        },
        {
            type: 'text',
            id: 5,
            title: 'Clean & Spacious Rooms',
            content: 'I have been staying here for six months, and the rooms are always kept spotless. The storage space is ample, and the ventilation is great, making it very comfortable.',
            author: 'Vikram Singh',
            rating: 5
        },
        { type: 'image', id: 6, src: 'https://images.unsplash.com/photo-1581428982868-e410dd98fc1c?auto=format&fit=crop&q=80', alt: 'Study Area' },
        {
            type: 'text',
            id: 7,
            title: 'Great Community Vibe',
            content: 'Beyond the great facilities, the atmosphere here is very welcoming. The common areas allow everyone to interact comfortably, making it easy to make good friends here.',
            author: 'Neha Deshmukh',
            rating: 5
        },
        { type: 'image', id: 8, src: 'https://images.unsplash.com/photo-1502672260266-1c1e525def50?auto=format&fit=crop&q=80', alt: 'Cozy Interior' },
    ];

    return (
        <div className="gallery-section animate-fade-in">
            <div className="container">
                <h1 className="gallery-main-title">Gallery & Reviews</h1>

                <div className="checkerboard-grid">
                    {blocks.map((block) => {
                        if (block.type === 'image') {
                            return (
                                <div key={block.id} className="gallery-block image-block">
                                    <img src={block.src} alt={block.alt} loading="lazy" />
                                </div>
                            );
                        } else {
                            return (
                                <div key={block.id} className="gallery-block text-block">
                                    <h3 className="block-title">{block.title}</h3>
                                    <p className="block-content">{block.content}</p>

                                    <div className="block-footer">
                                        <div className="reviewer">
                                            <div className="reviewer-avatar"></div>
                                            <span className="reviewer-name">{block.author}</span>
                                        </div>
                                        <div className="stars">
                                            {[...Array(block.rating)].map((_, i) => (
                                                <Star key={i} size={14} fill="currentColor" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        </div>
    );
}
