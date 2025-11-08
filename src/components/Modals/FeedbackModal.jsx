import React from 'react';
import FeedbackDisplay from '../TodayChallenge/FeedbackDisplay';

/**
 * A modal component just for displaying AI feedback.
 * It reuses the FeedbackDisplay component.
 */
const FeedbackModal = ({ feedback, onClose }) => {
    return (
        // We can reuse the CSS from the History Modal for the overlay/content
        <div className="history-modal-overlay" onClick={onClose}>
            <div className="history-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="history-modal-close" onClick={onClose}>×</button>
                {/* The FeedbackDisplay component is rendered inside */}
                <FeedbackDisplay feedback={feedback} />
            </div>
        </div>
    );
};

export default FeedbackModal;