import React from 'react';

const Loader = ({ message, isDark = false }) => {
    return (
        <div className="loader-container" style={isDark ? { color: 'white' } : {}}>
            <div className="loader" style={isDark ? { borderTopColor: 'white' } : {}}></div>
            <p>{message}</p>
        </div>
    );
};

export default Loader;