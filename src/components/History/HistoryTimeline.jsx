import React from 'react';
import HistoryItem from './HistoryItem';

const HistoryTimeline = ({ historyData, onOpenModal, onWordClick, apiBaseUrl }) => { // <-- Receive prop
    return (
        <div className="timeline">
            {historyData.map((entry, index) => (
                <HistoryItem
                    key={entry.date}
                    entry={entry}
                    index={index}
                    onOpenModal={onOpenModal}
                    onWordClick={onWordClick}
                    apiBaseUrl={apiBaseUrl} // <-- Pass prop down
                />
            ))}
        </div>
    );
};

export default HistoryTimeline;