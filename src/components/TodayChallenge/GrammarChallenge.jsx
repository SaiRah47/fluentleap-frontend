import React, { useState } from 'react';

const GrammarProblem = ({ problem }) => {
    const [answer, setAnswer] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);

    const handleChange = (e) => {
        const userAnswer = e.target.value;
        setAnswer(userAnswer);

        // Simple check: remove punctuation and case
        const simpleUserAnswer = userAnswer.trim().replace(/[.,!?;]$/, '');
        const simpleCorrectAnswer = problem.correct.trim().replace(/[.,!?;]$/, '');

        if (simpleUserAnswer.toLowerCase() === simpleCorrectAnswer.toLowerCase()) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
    };

    return (
        <div className="grammar-problem">
            <p className="incorrect-sentence">{problem.incorrect}</p>
            <textarea
                rows="2"
                value={answer}
                onChange={handleChange}
                placeholder="Type the corrected sentence here..."
            />
            {answer && (
                <p className={`grammar-feedback ${isCorrect ? 'correct' : 'pending'}`}>
                    {isCorrect ? '✓ Correct!' : 'Keep trying...'}
                </p>
            )}
        </div>
    );
};

const GrammarChallenge = ({ challenge }) => {
    return (
        <div className="grammar-challenge-container">
            <h3>{challenge.title}</h3>
            <p className="grammar-description">{challenge.description}</p>

            {challenge.problems.map(problem => (
                <GrammarProblem key={problem.id} problem={problem} />
            ))}
        </div>
    );
};

export default GrammarChallenge;