import React from 'react';

const IdiomCard = ({ idiomData }) => {
    if (!idiomData) {
        return null;
    }

    return (
        // We can reuse the grammar challenge styles for a consistent look
        <div className="grammar-challenge-container" style={{ marginTop: '2rem' }}>
            <h3 style={{ color: '#007bff' }}>Idiom of the Day</h3>

            <div className="grammar-problem" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                    {idiomData.idiom}
                </h4>

                <p style={{ fontStyle: 'italic', color: '#555', marginBottom: '1rem' }}>
                    {idiomData.meaning}
                </p>

                <p style={{ color: '#333' }}>
                    <strong>Example:</strong> "{idiomData.example}"
                </p>
            </div>
        </div>
    );
};

export default IdiomCard;