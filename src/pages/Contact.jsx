import { Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '../components/ToastContext';
import './Contact.css';

export default function Contact() {
    const { addToast } = useToast();

    const handleSubmit = (e) => {
        e.preventDefault();
        addToast('Message sent successfully! We will get back to you soon.', 'success');
    };

    return (
        <div className="section container animate-fade-in contact-page">
            <h1 className="heading-1 text-center">Contact Us</h1>
            <p className="text-center text-muted facilities-subtitle">We would love to hear from you.</p>

            <div className="contact-grid">
                <div className="card contact-info">
                    <h2 className="heading-3">Get in Touch</h2>

                    <div className="info-item">
                        <MapPin className="contact-icon" />
                        <div>
                            <strong>Address</strong>
                            <p className="text-muted" style={{ textTransform: 'capitalize' }}>in front of wellness medical parandwadi road, parandwadi</p>
                        </div>
                    </div>

                    <div className="info-item">
                        <Phone className="contact-icon" />
                        <div>
                            <strong>Phone</strong>
                            <p className="text-muted">7040004604</p>
                        </div>
                    </div>

                    <div className="info-item">
                        <Mail className="contact-icon" />
                        <div>
                            <strong>Email</strong>
                            <p className="text-muted">info@shreesamarthpg.com</p>
                        </div>
                    </div>

                    <div className="text-center" style={{ marginTop: '2rem' }}>
                        <a href="https://maps.app.goo.gl/c75xjmJyfdzy8Q7E7" target="_blank" rel="noopener noreferrer" className="btn btn-primary location-btn">
                            View Location on Map
                        </a>
                    </div>
                </div>

                <form className="card contact-form" onSubmit={handleSubmit}>
                    <h2 className="heading-3">Send a Message</h2>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" required placeholder="John Doe" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" required placeholder="john@example.com" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea id="message" rows="4" required placeholder="How can we help?"></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary send-msg-btn">Send Message</button>
                </form>
            </div>
        </div>
    );
}
