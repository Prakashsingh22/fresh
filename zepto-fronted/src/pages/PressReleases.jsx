import React from 'react';
import Header from '../components/Header';
import './styles/PressReleases.css';

const PressReleases = () => {
    const news = [
        {
            date: 'February 24, 2026',
            title: 'Freshcart Launches 50th Smart Warehouse in Pune',
            content: 'Expanding our footprint to ensure 10-minute delivery for every corner of the city. Our new Pune facility features AI-driven inventory management.',
            tag: 'Growth'
        },
        {
            date: 'January 15, 2026',
            title: 'Introducing OTP-Based Secure Delivery System',
            content: 'Freshcart introduces a new layer of security with encrypted OTP delivery to prevent order theft and ensure precision in every drop-off.',
            tag: 'Feature'
        },
        {
            date: 'December 20, 2025',
            title: 'Freshcart Secures Series B Funding for Expansion',
            content: 'We are excited to announce a $50M investment to scale our billing automation and robotics in sorting facilities.',
            tag: 'Funding'
        },
        {
            date: 'November 05, 2025',
            title: 'Partnership with Local Organic Farms in Delhi',
            content: 'Freshcart partners with 200+ organic farmers to bring farm-to-door vegetables within 4 hours of harvesting.',
            tag: 'Partnership'
        }
    ];

    return (
        <div className="press-page">
            <Header />
            <div className="press-container">
                <header className="press-header">
                    <h1>Press Releases</h1>
                    <p>Stay updated with the latest news and announcements from Freshcart.</p>
                </header>

                <div className="news-list">
                    {news.map((item, index) => (
                        <article key={index} className="news-item">
                            <div className="news-date">
                                {item.date} <span className="press-tag">{item.tag}</span>
                            </div>
                            <h2>{item.title}</h2>
                            <p>{item.content}</p>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PressReleases;
