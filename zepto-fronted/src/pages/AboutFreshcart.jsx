import React from 'react';
import Header from '../components/Header';
import './styles/AboutFreshcart.css';
// Note: User needs to save provided images to src/assets/founders/
import geetaImg from '../assets/founders/geeta_singh.jpeg';
import prakashImg from '../assets/founders/prakash_singh.jpeg';

const AboutFreshcart = () => {
    return (
        <div className="about-page">
            <Header />
            <div className="about-container">
                <section className="about-hero">
                    <h1>About Freshcart</h1>
                    <p>Welcome to Freshcart, your ultimate destination for fresh groceries delivered right to your doorstep. We are redefining the way you shop for your daily needs.</p>
                </section>

                <section className="about-section">
                    <h2>Company Introduction</h2>
                    <div className="card">
                        <p>Freshcart is a cutting-edge grocery delivery platform designed to bring convenience, quality, and speed to your life. We bridge the gap between local farms and your kitchen, ensuring that you get the freshest produce without the hassle of stepping out.</p>
                    </div>
                </section>

                <section className="about-section">
                    <div className="mission-vision">
                        <div className="card">
                            <h3>Our Mission</h3>
                            <p>To provide every household with access to fresh, high-quality groceries within minutes, while supporting local farmers and sustainable practices.</p>
                        </div>
                        <div className="card">
                            <h3>Our Vision</h3>
                            <p>To become India's most trusted and efficient grocery delivery ecosystem, powered by technology and human care.</p>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>Founding Story</h2>
                    <div className="card">
                        <p>It all started with a simple observation: why should getting fresh vegetables be so time-consuming and inconsistent? Founded in 2024, Geeta Singh and Prakash Singh envisioned a system where technology could optimize the entire supply chain, making 10-minute deliveries a reality. Their mission is to build a tech-driven, warehouse-powered delivery network that supports local businesses and empowers small sellers across India.</p>
                    </div>
                </section>

                <section className="about-section">
                    <h2>Our Leadership</h2>
                    <div className="founders-grid">
                        <div className="founder-card">
                            <img src={geetaImg} alt="Geeta Singh" className="founder-image founder-geeta" />
                            <div className="founder-info">
                                <h3>Geeta Singh</h3>
                                <p className="founder-title">Founder & CEO</p>
                                <p className="founder-tagline">“Building India’s fastest hyperlocal grocery network.”</p>
                                <div className="founder-details">
                                    <span>Born: 01/01/1971</span>
                                    <span>From: Uttar Pradesh</span>
                                </div>
                            </div>
                        </div>
                        <div className="founder-card">
                            <img src={prakashImg} alt="Prakash Singh" className="founder-image founder-prakash" />
                            <div className="founder-info">
                                <h3>Prakash Singh</h3>
                                <p className="founder-title">Co-Founder</p>
                                <p className="founder-tagline">“Revolutionizing retail through tech-driven delivery.”</p>
                                <div className="founder-details">
                                    <span>Born: 22/10/1998</span>
                                    <span>Education: B.Tech</span>
                                    <span>From: Delhi</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>What Makes Us Different</h2>
                    <div className="values-grid">
                        <div className="value-item">
                            <h4>Direct Sourcing</h4>
                            <p>We work directly with producers to ensure quality and better prices.</p>
                        </div>
                        <div className="value-item">
                            <h4>Ultra-Fast Delivery</h4>
                            <p>Our warehouse-to-door model ensures delivery in record time.</p>
                        </div>
                        <div className="value-item">
                            <h4>Quality Guarantee</h4>
                            <p>Every item undergoes multi-stage quality checks.</p>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>Core Values</h2>
                    <div className="values-grid">
                        <div className="value-item">
                            <h4>Quality First</h4>
                        </div>
                        <div className="value-item">
                            <h4>Customer Transparence</h4>
                        </div>
                        <div className="value-item">
                            <h4>Innovation</h4>
                        </div>
                        <div className="value-item">
                            <h4>Affordability</h4>
                        </div>
                    </div>
                </section>

                <section className="about-section">
                    <h2>Service Areas</h2>
                    <div className="service-areas">
                        <p>We currently operate in the following cities:</p>
                        <ul>
                            <li>Mumbai</li>
                            <li>Delhi NCR</li>
                            <li>Bangalore</li>
                            <li>Hyderabad</li>
                            <li>Pune</li>
                            <li>Chennai</li>
                        </ul>
                    </div>
                </section>

                <section className="about-section">
                    <h2>Our Model</h2>
                    <div className="card">
                        <p>Our unique <strong>Warehouse & Delivery Model</strong> relies on hyper-local "dark stores" strategically placed across the city. This allows our delivery partners to reach your location within 10 minutes, maintaining the "Fresh" in Freshcart.</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutFreshcart;
