import React from 'react';
import Header from '../components/Header';
import './styles/LegalPages.css';

const PrivacyPolicy = () => {
    return (
        <div className="legal-page">
            <Header />
            <div className="legal-container">
                <header className="legal-hero">
                    <h1>Privacy Policy</h1>
                    <p>Your privacy is important to us. Here's how we protect your data.</p>
                </header>

                <div className="legal-section">
                    <h2>1. Information Collection</h2>
                    <p>We collect information you provide directly to us, such as when you create an account, place an order, or contact customer support. This may include your name, email, phone number, and delivery address.</p>

                    <h2>2. How We Use Information</h2>
                    <p>We use the information we collect to process your orders, provide customer support, improve our services, and communicate with you about promotions and updates.</p>

                    <h2>3. Data Protection</h2>
                    <p>We use industry-standard security measures to protect your personal information from unauthorized access, disclosure, or alteration.</p>

                    <h2>4. Sharing Information</h2>
                    <p>We do NOT sell your personal information. We may share data with trusted partners who help us deliver our services, such as payment processors and delivery partners.</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
