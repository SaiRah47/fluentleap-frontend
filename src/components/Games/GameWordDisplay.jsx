import React from 'react';

const GameWordDisplay = ({ word, guessedLetters }) => {
    return (
        <div className="game-word-display">
            {word.split('').map((letter, index) => (
                <span key={index} className="game-letter-blank">
                    {guessedLetters.has(letter.toLowerCase()) ? letter : ''}
                </span>
            ))}
        </div>
    );
};

export default GameWordDisplay;