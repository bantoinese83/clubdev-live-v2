import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import StreamerInterface from '../../components/StreamerInterface.jsx';
import ViewerInterface from '../../components/ViewerInterface.jsx';
import io from 'socket.io-client';

const RoomPage = ({ params }) => {
    const router = useRouter();
    const { roomId } = params;
    const [isStreamer, setIsStreamer] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io('http://localhost:3001');
        socketRef.current.emit('join-room', roomId);

        socketRef.current.on('connect', () => {
            setIsConnected(true);
        });

        socketRef.current.on('disconnect', () => {
            setIsConnected(false);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [roomId]);

    const handleRoleSelection = (role) => {
        setIsStreamer(role === 'streamer');
    };

    if (!isConnected) {
        return <div>Connecting...</div>;
    }

    return (
        <div>
            {!isStreamer ? (
                <div>
                    <h2>Select your role:</h2>
                    <button onClick={() => handleRoleSelection('streamer')}>Streamer</button>
                    <button onClick={() => handleRoleSelection('viewer')}>Viewer</button>
                </div>
            ) : (
                <StreamerInterface roomId={roomId} />
            )}
            {isStreamer === false && <ViewerInterface roomId={roomId} />}
        </div>
    );
};

export default RoomPage;
