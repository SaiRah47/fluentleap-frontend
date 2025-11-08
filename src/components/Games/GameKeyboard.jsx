import React from 'react';

const GameKeyboard = ({ guessedLetters, onLetterClick }) => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

    return (
        <div className="game-keyboard">
            {alphabet.map(letter => {
                const isGuessed = guessedLetters.has(letter);
                const status = isGuessed ? (guessedLetters.get(letter) ? 'correct' : 'wrong') : '';

                return (
                    <button
                        key={letter}
                        className={`game-key ${status}`}
                        onClick={() => onLetterClick(letter)}
                        disabled={isGuessed}
                    >
                        {letter}
                    </button>
                );
            })}
        </div>
    );
};

export default GameKeyboard;