import React from 'react';

const WordButtonCard = ({ wordData, onWordClick, isRead }) => {
    return (
        <button
            className={`word-button-card ${isRead ? 'is-read' : ''}`}
            onClick={() => onWordClick(wordData)}
        >
            <span className="word-button-title">{wordData.word}</span>
            <span className="word-button-hint">
                {isRead ? '✓ Read' : 'Click to view details'}
            </span>
        </button>
    );
};

export default WordButtonCard;