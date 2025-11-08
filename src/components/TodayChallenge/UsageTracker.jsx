import React from 'react';

const UsageTracker = ({ words, usedWords }) => {
    return (
        <div className="usage-tracker">
            <h4>Word Usage Tracker</h4>
            <div className="usage-list">
                {words.map(word => (
                    <span
                        key={word}
                        className={`usage-tag ${usedWords.has(word) ? 'used' : ''}`}
                    >
                        {word}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default UsageTracker;