import React from 'react';

const UsageTracker = ({ wordData, dailyIdioms, usedWords, storyText }) => {
    // `usedWords` is the Set calculated in App.jsx.
    // This component is now just for displaying the tags.

    return (
        <div className="usage-tracker">
            <h4>Word Usage Tracker</h4>
            <div className="usage-list">

                {/* --- THIS IS THE FIX --- */}
                {/* We map over `wordData` (objects) not `words` (strings) */}
                {wordData && wordData.map(data => (
                    <span
                        key={data.word}
                        className={`usage-tag ${usedWords.has(data.word) ? 'used' : ''}`}
                    >
                        {data.word}
                    </span>
                ))}
                {/* --- END FIX --- */}

            </div>

            {dailyIdioms && dailyIdioms.length > 0 && (
                <>
                    <h4 style={{ marginTop: '0.75rem' }}>Idiom Tracker</h4>
                    <div className="usage-list">
                        {dailyIdioms.map(idiom => (
                            <span
                                key={idiom.word}
                                className={`usage-tag ${usedWords.has(idiom.word) ? 'used' : ''}`}
                                title={`Meaning: ${idiom.meaning}`}
                            >
                                {idiom.word}
                            </span>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default UsageTracker;