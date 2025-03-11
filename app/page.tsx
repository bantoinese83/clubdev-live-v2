// app/page.tsx
'use client'; // Mark this as a client component since it uses useState and useRouter

import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'; // Use next/navigation for useRouter in app directory

const HomePage: React.FC = () => {
    const router = useRouter(); // Get the router instance

    const createRoomId = () => uuidv4();

    const handleCreateRoom = () => {
        const roomId = createRoomId();
        router.push(`/room/${roomId}`); // Programmatically navigate using router.push
    };

    // Basic styling - you can customize with CSS modules or Tailwind CSS
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
        textDecoration: 'none', // Remove underline from link if using <a> tag directly
        display: 'inline-block', // To style as a button-like link
    };

    return (
        <div style={containerStyle}>
            <h1>Welcome to ClubDev Live</h1>
            <p>Start coding live in public!</p>
            {/* Using button with onClick and router.push for navigation */}
            <button style={buttonStyle} onClick={handleCreateRoom}>
                Create New Room
            </button>
            {/* Optionally, you can add a "Join Room" input and button here later */}
        </div>
    );
};

export default HomePage;