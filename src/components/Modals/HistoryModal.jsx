import React from 'react';
import FeedbackDisplay from '../TodayChallenge/FeedbackDisplay';

const HistoryModal = ({ entry, onClose, onWordClick }) => {
    return (
        <div className="history-modal-overlay" onClick={onClose}>
            <div className="history-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="history-modal-close" onClick={onClose}>×</button>

                <h2>Story from {entry.date}</h2>
                <p className="history-modal-date">{entry.date}</p>

                <div className="history-modal-words">
                    {/* Loop over word_data to make words clickable */}
                    {entry.word_data.map(wd => (
                        <span
                            key={wd.word}
                            className="timeline-word-tag"
                            onClick={() => onWordClick(wd)}
                            style={{ cursor: 'pointer' }} // Add pointer to show it's clickable
                        >
                            {wd.word}
                        </span>
                    ))}
                </div>

                {/* Only show story/feedback if they exist */}
                {entry.story && (
                    <>
                        <h3>Your Story</h3>
                        <p className="history-modal-story">{entry.story}</p>
                    </>
                )}

                {entry.feedback && (
                    <div className="history-modal-feedback">
                        <FeedbackDisplay feedback={entry.feedback} />
                    </div>
                )}

                {/* Show if no story was written */}
                {!entry.story && (
                    <p className="history-modal-story" style={{ fontStyle: 'italic', color: '#888' }}>You didn't write a story on this day.</p>
                )}
            </div>
        </div>
    );
};

export default HistoryModal;