import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { Mail, Phone, HelpCircle, FileText, RefreshCcw } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import './styles/LegalPages.css';

const HelpSupport = () => {
    return (
        <div className="legal-page">
            <Header />
            <div className="legal-container">
                <header className="legal-hero">
                    <h1>Help & Support</h1>
                    <p>How can we assist you today?</p>
                </header>
                <div className="contact-grid">
                    <Link to="/faq" className="contact-info-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <HelpCircle size={32} color="#232f3e" />
                        <h3>FAQs</h3>
                        <p>Find quick answers to common questions.</p>
                    </Link>

                    <Link to="/contact" className="contact-info-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Mail size={32} color="#232f3e" />
                        <h3>Contact Us</h3>
                        <p>Send us a message or find our details.</p>
                    </Link>

                    <Link to="/refund-policy" className="contact-info-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <RefreshCcw size={32} color="#232f3e" />
                        <h3>Refunds & Returns</h3>
                        <p>Learn about our return guidelines.</p>
                    </Link>

                    <Link to="/terms" className="contact-info-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <FileText size={32} color="#232f3e" />
                        <h3>Terms of Service</h3>
                        <p>Read our usage agreements.</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HelpSupport;
