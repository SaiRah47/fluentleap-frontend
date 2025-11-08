import React, { useState, useEffect } from 'react';
import GameKeyboard from '../Games/GameKeyboard';
import GameWordDisplay from '../Games/GameWordDisplay';

const GameModal = ({ onClose, allLearnedWords }) => {
    const [currentWord, setCurrentWord] = useState(null);
    const [guessedLetters, setGuessedLetters] = useState(new Map()); // Map to store letter -> isCorrect
    const [wrongGuesses, setWrongGuesses] = useState(new Set());

    const MAX_STRIKES = 6;

    const startGame = () => {
        if (allLearnedWords.length === 0) {
            onClose(); // Close if no words are available
            return;
        }
        // Get a random word from the learned words
        const randomWord = allLearnedWords[Math.floor(Math.random() * allLearnedWords.length)];
        setCurrentWord(randomWord);
        setGuessedLetters(new Map());
        setWrongGuesses(new Set());
    };

    // Start the game on component mount
    useEffect(() => {
        startGame();
    }, [allLearnedWords]); // Re-roll if learned words change (though modal will likely close)

    const handleLetterClick = (letter) => {
        if (!currentWord) return;

        const isCorrect = currentWord.word.toLowerCase().includes(letter);
        setGuessedLetters(prev => new Map(prev).set(letter, isCorrect));

        if (!isCorrect) {
            setWrongGuesses(prev => new Set(prev).add(letter));
        }
    };

    if (!currentWord) {
        return ( // Loading state or no words state
            <div className="modal-overlay" onClick={onClose}>
                <div className="game-modal-content" onClick={(e) => e.stopPropagation()}>
                    <p>Loading game...</p>
                </div>
            </div>
        );
    }

    // Check for win condition
    const wordLetters = new Set(currentWord.word.toLowerCase().split(''));
    const correctGuessedLetters = new Set(
        [...guessedLetters.keys()].filter(k => guessedLetters.get(k))
    );
    const isWinner = [...wordLetters].every(letter => correctGuessedLetters.has(letter));

    const strikes = wrongGuesses.size;
    const isLoser = strikes >= MAX_STRIKES;
    const isGameOver = isWinner || isLoser;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="game-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" style={{ color: 'black', background: '#f0f0f0' }} onClick={onClose}>&times;</button>

                <h2>Word Guesser</h2>

                {!isGameOver && (
                    <React.Fragment>
                        <div className="game-clue">
                            <strong>Clue:</strong> {currentWord.meaning}
                        </div>

                        <p className="game-strikes">Strikes: {strikes} / {MAX_STRIKES}</p>

                        <GameWordDisplay word={currentWord.word} guessedLetters={correctGuessedLetters} />

                        <GameKeyboard
                            guessedLetters={guessedLetters}
                            onLetterClick={handleLetterClick}
                        />
                    </React.Fragment>
                )}

                {isGameOver && (
                    <div className="game-status-message">
                        {isWinner && (
                            <h3 className="win">You Win!</h3>
                        )}
                        {isLoser && (
                            <h3 className="lose">You Lost!</h3>
                        )}
                        <p className="correct-word">The word was: <strong>{currentWord.word}</strong></p>

                        <button className="btn-play-again" onClick={startGame}>
                            Play Again
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default GameModal;