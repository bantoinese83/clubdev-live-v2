// pages/index.tsx
import React from 'react';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

const HomePage: React.FC = () => {
    const createRoomId = () => uuidv4();

    return (
        <div>
            <h1>Welcome to ClubDev Live</h1>
            <p>Start coding live in public!</p>
            <Link href={`/room/${createRoomId()}`}>
                <a>Create New Room</a>
            </Link>
            {/* Optionally: Join existing room input */}
        </div>
    );
};

export default HomePage;