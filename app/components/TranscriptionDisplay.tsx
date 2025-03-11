// components/TranscriptionDisplay.tsx
import React from 'react';

interface TranscriptionDisplayProps {
    transcription: string;
}

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ transcription }) => {
    // Basic styling for the transcription display area
    const containerStyle: React.CSSProperties = {
        border: '1px solid #ccc',
        padding: '10px',
        borderRadius: '5px',
        height: '150px', // Fixed height for scrollable area
        overflowY: 'auto', // Enable vertical scroll if content overflows
        backgroundColor: '#fff',
        marginBottom: '10px',
    };

    return (
        <div style={containerStyle}>
            <p>{transcription}</p>
        </div>
    );
};

export default TranscriptionDisplay;