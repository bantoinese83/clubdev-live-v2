// pages/room/[roomId].tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import StreamerInterface from '../../components/StreamerInterface';
import ViewerInterface from '../../components/ViewerInterface';

const RoomPage: React.FC = () => {
    const router = useRouter();
    const { roomId } = router.query;
    const [isStreamer, setIsStreamer] = useState<boolean>(false); // Basic role determination - can be improved

    useEffect(() => {
        // Simple way to determine streamer role for MVP - first person in room is streamer.
        // In a real app, you'd need more robust role management, maybe using signaling.
        // For now, assume creator of the room URL is the streamer.
        setIsStreamer(true); // For simplicity, anyone accessing the room URL is assumed streamer.
    }, [roomId]);

    if (!roomId) {
        return <div>Loading...</div>; // Or handle no roomId case
    }

    return (
        <div>
            <h1>Room ID: {roomId}</h1>
            {isStreamer ? (
                <StreamerInterface roomId={roomId as string} />
            ) : (
                <ViewerInterface roomId={roomId as string} />
            )}
        </div>
    );
};

export default RoomPage;