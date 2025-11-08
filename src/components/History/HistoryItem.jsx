import React from 'react';

const HistoryItem = ({ entry, index, onOpenModal, onWordClick, apiBaseUrl }) => {
    const itemClass = index % 2 === 0 ? 'even' : 'odd';

    // --- THIS IS THE FIX ---
    // We create a style object.
    const polaroidStyle = {};
    if (entry.story_image_url) {
        // If the URL exists, we set the CSS variable.
        polaroidStyle['--image-url'] = `url(${apiBaseUrl}${entry.story_image_url})`;
    }
    // If the URL *doesn't* exist, we add nothing to the style object.
    // The CSS will automatically use its fallback gradient.
    // --- END OF FIX ---

    return (
        <div className={`timeline-item ${itemClass}`} onClick={() => onOpenModal(entry)}>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
                <div className="polaroid">
                    <div
                        className="polaroid-image"
                        style={polaroidStyle} // <-- Apply the style object here
                    >
                        {/* Show words only if there's NO image */}
                        {!entry.story_image_url && entry.words.join(' • ')}
                    </div>
                </div>
                <p className="timeline-date">{entry.date}</p>
                <div className="timeline-words">
                    {entry.word_data.map(wd => (
                        <span
                            key={wd.word}
                            className="timeline-word-tag"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent history modal from opening
                                onWordClick(wd); // Open word modal
                            }}
                        >
                            {wd.word}
                        </span>
                    ))}
                </div>
                {entry.story && (
                    <p className="timeline-preview">{entry.story}</p>
                )}
                {!entry.story && (
                    <p className="timeline-preview" style={{ fontStyle: 'italic', color: '#888' }}>No story was written on this day.</p>
                )}
            </div>
        </div>
    );
};

export default HistoryItem;