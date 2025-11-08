import React from 'react';
import { SearchIcon } from './Icons';

const FloatingLookupButton = ({ onClick }) => {
    return (
        <button className="floating-action-btn" onClick={onClick} title="Look up a word">
            <SearchIcon />
        </button>
    );
};

export default FloatingLookupButton;