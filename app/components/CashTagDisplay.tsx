// components/CashTagDisplay.tsx
import React from 'react';

interface CashTagDisplayProps {
    cashTags: string;
}

const CashTagDisplay: React.FC<CashTagDisplayProps> = ({ cashTags }) => {
    if (!cashTags) {
        return null; // Or return a default message if you prefer
    }

    // Basic styling - you can customize this
    const containerStyle: React.CSSProperties = {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        marginBottom: '10px',
        backgroundColor: '#f9f9f9',
    };

    return (
        <div style={containerStyle}>
            <p>Support the Streamer:</p>
            <p>{cashTags}</p>
            {/* You can add links or formatting based on how you want to display cash tags */}
        </div>
    );
};

export default CashTagDisplay;