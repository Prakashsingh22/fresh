import React from 'react';
import Header from '../components/Header';
import './styles/FreshcartScience.css';

const FreshcartScience = () => {
    return (
        <div className="science-page">
            <Header />
            <div className="science-container">
                <section className="science-hero">
                    <h1>Freshcart Science</h1>
                    <p>Engineering the future of hyper-local logistics and supply chain optimization.</p>
                </section>

                <div className="tech-grid">
                    <div className="tech-card">
                        <h3>Delivery Algorithm</h3>
                        <p>Our proprietary "Zepto-Path" algorithm uses real-time traffic data, rider availability, and delivery density to calculate the optimal route for every order. It predicts delivery times within a 30-second margin of error.</p>
                    </div>

                    <div className="tech-card">
                        <h3>Warehouse Optimization</h3>
                        <p>Our "Dark Store" optimization system uses computer vision and IoT sensors to track inventory levels in real-time, ensuring that pickers can fulfill an order in under 60 seconds of it being placed.</p>
                    </div>

                    <div className="tech-card">
                        <h3>Billing Automation</h3>
                        <p>We've implemented a fully automated billing and tax calculation engine that handles thousands of requests per second, ensuring zero errors in pricing and seamless invoice generation.</p>
                    </div>

                    <div className="tech-card">
                        <h3>Inventory Intelligence</h3>
                        <p>Using predictive analytics, we forecast demand for specific items based on hyper-local trends (e.g., weather, festivals, meal times) so our warehouses are always stocked with what you need before you even know it.</p>
                    </div>
                </div>

                <section className="science-footer">
                    <h2>Innovation at Scale</h2>
                    <p>We are constantly experimenting with AI and Machine Learning to improve efficiency and reduce environment impact through optimized vehicle routing. Freshcart isn't just a grocery app; it's a technology company solving complex logistics problems.</p>
                </section>
            </div>
        </div>
    );
};

export default FreshcartScience;
