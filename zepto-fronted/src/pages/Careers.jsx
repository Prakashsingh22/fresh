import React from 'react';
import Header from '../components/Header';
import './styles/Careers.css';

const Careers = () => {
    const jobs = [
        { title: 'Admin', type: 'Full-time', location: 'Remote/Hybrid' },
        { title: 'Warehouse Admin', type: 'On-site', location: 'Mumbai/Delhi' },
        { title: 'Delivery Partner', type: 'Flexible', location: 'All Major Cities' },
        { title: 'Developer (React/Java)', type: 'Full-time', location: 'Remote' },
        { title: 'Operations Intern', type: 'Internship', location: 'Multiple' }
    ];

    return (
        <div className="careers-page">
            <Header />
            <div className="careers-container">
                <section className="careers-hero">
                    <h1>Join the Freshcart Team</h1>
                    <p>Build the future of grocery delivery with us. We are looking for passionate individuals to join our mission.</p>
                </section>

                <section className="job-section">
                    <h2>Current Openings</h2>
                    <div className="job-grid">
                        {jobs.map((job, index) => (
                            <div key={index} className="job-card">
                                <span className="job-tag">{job.type}</span>
                                <h3>{job.title}</h3>
                                <p>{job.location}</p>
                                <button className="apply-btn" style={{ padding: '8px 20px', fontSize: '0.9rem', marginTop: 'auto' }}>Apply Now</button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="culture-section">
                    <h2>Our Work Culture</h2>
                    <p>At Freshcart, we believe in radical transparency, ownership, and speed. Our team is a mix of tech enthusiasts and logistics experts working together to solve real-world problems. We value diversity, creativity, and the "Day 1" mentality.</p>
                </section>

                <section className="job-section">
                    <h2>Benefits</h2>
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <h4>Competitive Salary</h4>
                            <p>Industry-standard compensation packages.</p>
                        </div>
                        <div className="benefit-card">
                            <h4>Growth Path</h4>
                            <p>Fast-track your career with clear milestones.</p>
                        </div>
                        <div className="benefit-card">
                            <h4>Flexible Hours</h4>
                            <p>Work at your best with our flexible policy.</p>
                        </div>
                        <div className="benefit-card">
                            <h4>Health & Wellness</h4>
                            <p>Comprehensive health insurance for you and your family.</p>
                        </div>
                    </div>
                </section>

                <section className="apply-section">
                    <h2>Ready to grow with us?</h2>
                    <p>If you don't see a role that fits but still want to join, send us your resume!</p>
                    <a href="mailto:careers@freshcart.in" className="apply-btn">Email Resume</a>
                </section>
            </div>
        </div>
    );
};

export default Careers;
