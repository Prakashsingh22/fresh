import React from 'react';
import Header from '../components/Header';
import './styles/LegalPages.css';

const TermsConditions = () => {
    return (
        <div className="legal-page">
            <Header />
            <div className="legal-container">
                <header className="legal-hero">
                    <h1>Terms & Conditions</h1>
                    <p>Please read these terms carefully before using Freshcart.</p>
                </header>

                <div className="legal-section">
                    <h2>1. Acceptance of Terms</h2>
                    <p>By using Freshcart, you agree to be bound by these Terms and Conditions and our Privacy Policy.</p>

                    <h2>2. Account Registration</h2>
                    <p>You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.</p>

                    <h2>3. Ordering and Delivery</h2>
                    <p>All orders are subject to availability. We aim for 10-minute delivery, but external factors like traffic and weather may cause delays.</p>

                    <h2>4. Payments</h2>
                    <p>Payments must be made through our authorized payment gateways. Freshcart is not responsible for any unauthorized transactions made outside our platform.</p>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;
