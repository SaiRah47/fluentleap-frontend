import React, { useState } from 'react';
import { SpeakerIcon } from '../Common/Icons';

const WordLookupModal = ({ onClose, getWordDetails, playAudio }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [wordData, setWordData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setIsLoading(true);
        setWordData(null);
        const data = await getWordDetails(searchTerm.trim());
        setWordData(data);
        setIsLoading(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>

                <form className="lookup-search-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Enter any word..."
                        autoFocus
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? '...' : 'Search'}
                    </button>
                </form>

                {isLoading && (
                    <div className="modal-loader-container">
                        <div className="modal-loader"></div>
                    </div>
                )}

                {wordData && (
                    <React.Fragment>
                        <h2 className="modal-word-title">{wordData.word}</h2>
                        <p className="modal-pronunciation">{wordData.ipa}</p>

                        <button
                            className="audio-btn"
                            onClick={() => playAudio(wordData.word)}
                            disabled={wordData.ipa === 'N/A' || !wordData.word}
                        >
                            <SpeakerIcon /> Listen
                        </button>

                        <div className="modal-info-section">
                            <h4>Meaning</h4>
                            <p>{wordData.meaning}</p>
                        </div>
                        <div className="modal-info-section">
                            <h4>Synonyms</h4>
                            <div className="tags">
                                {wordData.synonyms.split(',').map(s => s.trim() ? <span key={s.trim()} className="tag">{s.trim()}</span> : null)}
                            </div>
                        </div>
                        <div className="modal-info-section">
                            <h4>Antonyms</h4>
                            <div className="tags">
                                {wordData.antonyms.split(',').map(a => a.trim() ? <span key={a.trim()} className="tag">{a.trim()}</span> : null)}
                            </div>
                        </div>
                        {wordData.collocations && (
                            <div className="modal-info-section">
                                <h4>Common Collocations</h4>
                                <div className="tags">
                                    {wordData.collocations.split(',').map(c => c.trim() ? <span key={c.trim()} className="tag">{c.trim()}</span> : null)}
                                </div>
                            </div>
                        )}
                        {/* Handle single or multiple sentences from backend */}
                        {(wordData.sentences && wordData.sentences.length > 0) ? (
                            <div className="modal-info-section example">
                                <h4>Examples</h4>
                                {wordData.sentences.map((sentence, index) => (
                                    <p key={index}><em>"{sentence}"</em></p>
                                ))}
                            </div>
                        ) : (wordData.sentence && (
                            <div className="modal-info-section example">
                                <h4>Example</h4>
                                <p><em>"{wordData.sentence}"</em></p>
                            </div>
                        ))}
                    </React.Fragment>
                )}

                {!isLoading && !wordData && (
                    <div className="lookup-placeholder">
                        <p>Find definitions, synonyms, and more.</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default WordLookupModal;