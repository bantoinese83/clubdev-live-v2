// components/RoomIdDisplay.tsx
import React from 'react';

interface RoomIdDisplayProps {
    roomId: string;
}

const RoomIdDisplay: React.FC<RoomIdDisplayProps> = ({ roomId }) => {
    // Basic styling
    const displayStyle: React.CSSProperties = {
        fontWeight: 'bold',
        color: '#007bff',
        marginLeft: '10px',
    };

    return <span style={displayStyle}>{roomId}</span>;
};

export default RoomIdDisplay;