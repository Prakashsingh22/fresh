import axios from "axios";
import Header from '../components/Header';
import './styles/LegalPages.css';

const ContactUs = () => {
    return (
        <div className="legal-page">
            <Header />
            <div className="legal-container">
                <header className="legal-hero">
                    <h1>Contact Us</h1>
                    <p>We're here to help! Reach out to us for any queries or support.</p>
                </header>

                <div className="contact-grid">
                    <div className="contact-info-card">
                        <h3>Get in Touch</h3>
                        <p><strong>Email:</strong> support@freshcart.in</p>
                        <p><strong>Phone:</strong> +91 1800-FRESH-CART</p>
                        <p><strong>Address:</strong> 123, Green Tech Park, Sector 44, Gurgaon, Haryana, India</p>
                        <p><strong>Hours:</strong> Mon - Sun, 6:00 AM - 11:00 PM</p>
                    </div>

                    <form className="contact-form">
                        <h3>Send a Message</h3>
                        <input type="text" placeholder="Your Name" required />
                        <input type="email" placeholder="Your Email" required />
                        <textarea placeholder="How can we help?" rows="5" required></textarea>
                        <button type="submit" className="submit-btn">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
