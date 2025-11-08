import React from 'react';

const GameButtons = ({ onGameClick, onScrambleClick }) => {
    return (
        <div className="game-button-container">
            <button className="btn-game" onClick={onGameClick}>
                Play Word Guesser
            </button>
            <button className="btn-game" onClick={onScrambleClick}>
                Play Sentence Scramble
            </button>
        </div>
    );
};

export default GameButtons;