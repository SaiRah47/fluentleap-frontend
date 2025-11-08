import React from 'react';

const Hero = ({ onStartClick }) => {
    return (
        <section id="hero" className="hero section">
            <div className="hero-background">
                <div className="hero-gradient"></div>
                <div className="hero-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
            </div>
            <div className="hero-content">
                <h1 className="hero-title">
                    FluentLeap
                    <span className="hero-subtitle">— English Mastery Toolkit</span>
                </h1>
                <p className="hero-description">
                    Unlock fluent communication, build your best vocabulary, and accelerate your English mastery every day.
                </p>
                <button className="hero-cta" onClick={onStartClick}>
                    Start Learning Today
                    <span className="cta-arrow">↓</span>
                </button>
            </div>
        </section>
    );
};

export default Hero;