import React from 'react';
import { SpeakerIcon } from '../Common/Icons';

const WordModal = ({ wordData, onClose, playAudio }) => {
    // Fallback for sentences if not provided
    const sentences = wordData.sentences || (wordData.sentence ? [wordData.sentence] : []);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>

                <h2 className="modal-word-title">{wordData.word}</h2>
                <p className="modal-pronunciation">{wordData.ipa}</p>

                <button
                    className="audio-btn"
                    onClick={() => playAudio(wordData.word)}
                    disabled={!wordData.word || wordData.word === 'Error'}
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
                {sentences.length > 0 && (
                    <div className="modal-info-section example">
                        <h4>Examples</h4>
                        {sentences.map((sentence, index) => (
                            <p key={index}><em>"{sentence}"</em></p>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WordModal;