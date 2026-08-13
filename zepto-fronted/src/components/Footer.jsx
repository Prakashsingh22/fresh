import React from 'react';
import './Footer.css';
import { Globe, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer className="amazon-footer">
            <button className="back-to-top" onClick={scrollToTop}>
                <ArrowUp size={16} /> Back to top
            </button>

            <div className="footer-links-container">
                <div className="footer-column">
                    <h3>Get to Know Us</h3>
                    <ul>
                        <li><Link to="/about">About Freshcart</Link></li>
                        <li><Link to="/careers">Careers</Link></li>
                        <li><Link to="/press">Press Releases</Link></li>
                        <li><Link to="/science">Freshcart Science</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>Connect with Us</h3>
                    <ul>
                        <li><a href="https://facebook.com/freshcart" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                        <li><a href="https://twitter.com/freshcart" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                        <li><a href="https://www.instagram.com/freshcart2026/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>Make Money with Us</h3>
                    <ul>
                        <li><a href="#">Sell on Freshcart</a></li>
                        <li><a href="#">Sell under Freshcart Accelerator</a></li>
                        <li><a href="#">Protect and Build Your Brand</a></li>
                        <li><a href="#">Freshcart Global Selling</a></li>
                        <li><a href="#">Supply to Freshcart</a></li>
                        <li><a href="#">Become an Affiliate</a></li>
                        <li><a href="#">Fulfilment by Freshcart</a></li>
                        <li><a href="#">Advertise Your Products</a></li>
                        <li><a href="#">Freshcart Pay on Merchants</a></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h3>Let Us Help You</h3>
                    <ul>
                        <li><Link to="/account">Your Account</Link></li>
                        <li><Link to="/refund-policy">Returns Centre</Link></li>
                        <li><Link to="/help">Help & Support</Link></li>
                        <li><Link to="/faq">FAQs</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-brand-section">
                <div className="footer-logo">
                    <span className="logo-text">Freshcart</span>
                    <span className="logo-dot">.in</span>
                </div>

                <div className="footer-selectors">
                    <button className="selector-btn">
                        <Globe size={16} />
                        <span>English</span>
                    </button>
                    <button className="selector-btn">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg"
                            alt="India Flag"
                            className="flag-icon"
                        />
                        <span>India</span>
                    </button>
                </div>

                <div className="make-in-india">
                    <img
                        src="/makeInIndia.png"
                        alt="Make In India"
                        className="mii-logo"
                    />
                    <span className="mii-text">#MakeInIndia</span>
                </div>
            </div>


            <div className="footer-bottom">
                <div className="legal-links">
                    <Link to="/terms">Conditions of Use & Sale</Link>
                    <Link to="/privacy">Privacy Notice</Link>
                    <a href="#">Interest-Based Ads</a>
                </div>
                <div className="copyright">
                    © 2026, Freshcart.com, Inc. or its affiliates
                </div>
            </div>
        </footer>
    );
};

export default Footer;
