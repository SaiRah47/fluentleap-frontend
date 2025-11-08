import React, { useState, useEffect } from 'react';
import { shuffleArray } from '../../utils/shuffleArray';

// Helper to clean and compare sentences
const cleanSentence = (str) => {
    return str.trim().toLowerCase().replace(/[.,!?;]$/, '');
}

const SentenceScrambleModal = ({ onClose, allLearnedWords }) => {
    const [currentProblem, setCurrentProblem] = useState(null);
    const [scrambledWords, setScrambledWords] = useState([]);
    const [guessWords, setGuessWords] = useState([]);
    const [isCorrect, setIsCorrect] = useState(false);

    const startGame = () => {
        if (allLearnedWords.length === 0) {
            onClose();
            return;
        }

        let randomWord, randomSentence;
        // Keep trying until we find a word with at least one sentence
        while (!randomSentence) {
            randomWord = allLearnedWords[Math.floor(Math.random() * allLearnedWords.length)];
            const sentences = randomWord.sentences || (randomWord.sentence ? [randomWord.sentence] : []);
            if (sentences.length > 0) {
                randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
            }
        }

        const problem = {
            word: randomWord.word,
            sentence: randomSentence,
            cleanSentence: cleanSentence(randomSentence)
        };
        setCurrentProblem(problem);

        const words = randomSentence.split(' ').map((word, index) => ({ word, id: index }));
        setScrambledWords(shuffleArray([...words]));

        setGuessWords([]);
        setIsCorrect(false);
    };

    useEffect(() => {
        startGame();
    }, [allLearnedWords]);

    const checkAnswer = (currentGuess) => {
        const guessString = currentGuess.map(w => w.word).join(' ');
        if (cleanSentence(guessString) === currentProblem.cleanSentence) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
    };

    const handleScrambleClick = (wordObject) => {
        if (isCorrect) return; // Don't do anything if already correct
        const newScrambled = scrambledWords.filter(w => w.id !== wordObject.id);
        const newGuess = [...guessWords, wordObject];

        setScrambledWords(newScrambled);
        setGuessWords(newGuess);
        checkAnswer(newGuess);
    };

    const handleGuessClick = (wordObject) => {
        if (isCorrect) return; // Don't do anything if already correct
        const newGuess = guessWords.filter(w => w.id !== wordObject.id);
        const newScrambled = [...scrambledWords, wordObject];

        setGuessWords(newGuess);
        setScrambledWords(newScrambled); // Re-sort or just add? Re-shuffling bank could be confusing, just add.
        checkAnswer(newGuess);
    };

    const handleReset = () => {
        setGuessWords([]);
        const words = currentProblem.sentence.split(' ').map((word, index) => ({ word, id: index }));
        setScrambledWords(shuffleArray([...words]));
        setIsCorrect(false);
    }

    if (!currentProblem) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="game-modal-content" onClick={(e) => e.stopPropagation()}>
                    <p>Loading game...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="game-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" style={{ color: 'black', background: '#f0f0f0' }} onClick={onClose}>&times;</button>

                <h2>Sentence Scramble</h2>

                <div className="game-clue">
                    Unscramble this sentence featuring the word: <strong>{currentProblem.word}</strong>
                </div>

                <div className="scramble-guess-container">
                    {guessWords.map((wordObj) => (
                        <button
                            key={wordObj.id}
                            className="scramble-word-block"
                            onClick={() => handleGuessClick(wordObj)}
                            disabled={isCorrect}
                        >
                            {wordObj.word}
                        </button>
                    ))}
                </div>

                <div className="scramble-bank-container">
                    {scrambledWords.map((wordObj) => (
                        <button
                            key={wordObj.id}
                            className="scramble-word-block"
                            onClick={() => handleScrambleClick(wordObj)}
                            disabled={isCorrect}
                        >
                            {wordObj.word}
                        </button>
                    ))}
                </div>

                <button className="btn-reset-scramble" onClick={handleReset} disabled={isCorrect}>Reset</button>

                {isCorrect && (
                    <div className="game-status-message">
                        <h3 className="win">✓ Correct!</h3>
                        <button className="btn-play-again" onClick={startGame}>
                            Next Sentence
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SentenceScrambleModal;