import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

const HomePage: React.FC = () => {
    const router = useRouter();

    const createRoomId = () => uuidv4();

    const handleCreateRoom = () => {
        const roomId = createRoomId();
        router.push(`/room/${roomId}`);
    };

    const containerStyle: React.CSSProperties = {
        textAlign: 'center',
        padding: '50px',
    };

    const buttonStyle: React.CSSProperties = {
        padding: '10px 20px',
        fontSize: '1rem',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        textDecoration: 'none',
        display: 'inline-block',
    };

    return (
        <div style={containerStyle}>
            <h1>Welcome to ClubDev Live</h1>
            <p>Start coding live in public!</p>
            <button style={buttonStyle} onClick={handleCreateRoom}>
                Create New Room
            </button>
        </div>
    );
};

export default HomePage;
