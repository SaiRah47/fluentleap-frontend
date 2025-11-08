import React from 'react';

const FeedbackDisplay = ({ feedback }) => {
    // Handles the "### Header" format from the LLM
    const sections = feedback.split(/### (.*?)\n/g).filter(Boolean);

    return (
        <div className="feedback-container">
            <h3>AI Feedback</h3>
            {sections.map((item, index) => {
                if (index % 2 === 0) { // Header
                    return <h4 key={index}>{item.trim()}</h4>;
                } else { // Content
                    return (
                        <div key={index} className="feedback-content">
                            {item.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    );
                }
            })}
        </div>
    );
};

export default FeedbackDisplay;