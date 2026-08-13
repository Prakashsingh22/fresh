import React from 'react';
import Header from '../components/Header';
import "./styles/LegalPages.css";

const FAQ = () => {
    const faqs = [
        { q: 'How long does delivery take?', a: 'We aim for 10-minute delivery in supported areas.' },
        { q: 'What are the delivery charges?', a: 'Charges vary by distance and order value. Free delivery is available for orders above ₹199.' },
        { q: 'Can I cancel my order?', a: 'Orders can be cancelled before they are packed for delivery.' },
        { q: 'How do I track my order?', a: 'You can track your order in real-time from the "My Orders" section.' },
        { q: 'What should I do if my items are damaged?', a: 'Please contact us via the "Help & Support" or "Contact Us" page immediately.' }
    ];

    return (
        <div className="legal-page">
            <Header />
            <div className="legal-container">
                <header className="legal-hero">
                    <h1>Frequently Asked Questions</h1>
                    <p>Quick answers to common questions about Freshcart.</p>
                </header>

                <div className="legal-section">
                    {faqs.map((faq, index) => (
                        <div key={index} className="faq-item">
                            <h4>{faq.q}</h4>
                            <p>{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;
