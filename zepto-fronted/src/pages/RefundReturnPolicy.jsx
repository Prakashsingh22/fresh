import React from 'react';
import Header from '../components/Header';
import './styles/LegalPages.css';

const RefundReturnPolicy = () => {
    return (
        <div className="legal-page">
            <Header />
            <div className="legal-container">
                <header className="legal-hero">
                    <h1>Refund & Return Policy</h1>
                    <p>Clear guidelines for a smooth shopping experience.</p>
                </header>

                <div className="legal-section">
                    <h2>1. Perishable Items</h2>
                    <p>Due to the nature of fresh produce and dairy, these items can only be returned at the time of delivery if they are found to be damaged or of poor quality.</p>

                    <h2>2. Non-Perishable Items</h2>
                    <p>Packed goods can be returned within 24 hours of delivery if they are unopened and in their original packaging.</p>

                    <h2>3. Refund Process</h2>
                    <p>Once a return is approved, refunds are processed back to the original payment method within 3-5 business days.</p>

                    <h2>4. Incorrect Orders</h2>
                    <p>If you receive the wrong item, please notify us immediately through the app for a quick replacement or refund.</p>
                </div>
            </div>
        </div>
    );
};

export default RefundReturnPolicy;
