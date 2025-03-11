// components/StreamerInterface.tsx
import React, { useEffect, useRef, useState } from 'react';
import VideoDisplay from './VideoDisplay';
import CodeEditor from './CodeEditor';
import TranscriptionDisplay from './TranscriptionDisplay';
import ProfileSetup from './ProfileSetup';
import CashTagDisplay from './CashTagDisplay';
import RoomIdDisplay from './RoomIdDisplay';
import io from 'socket.io-client';

interface StreamerInterfaceProps {
    roomId: string;
}

const StreamerInterface: React.FC<StreamerInterfaceProps> = ({ roomId }) => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [transcription, setTranscription] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [profile, setProfile] = useState<{ name: string; cashTags: string }>({ name: '', cashTags: '' });

    const socketRef = useRef<SocketIOClient.Socket | null>(null);

    useEffect(() => {
        socketRef.current = io('http://localhost:3001'); // Replace with your signaling server URL

        socketRef.current.emit('join-room', roomId);

        // WebRTC, Web Speech API, Monaco Editor, Profile Setup logic will go here
        // ... (See detailed steps below)

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [roomId]);

    return (
        <div>
            <h2>Streamer View - Room: <RoomIdDisplay roomId={roomId} /></h2>
            <ProfileSetup onProfileUpdate={setProfile} />
            <CashTagDisplay cashTags={profile.cashTags} />
            <VideoDisplay videoStream={localStream} videoRef={localVideoRef} isLocal />
            <button onClick={async () => {
                const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
                setLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
                // WebRTC stream sending logic...
            }}>Share Screen</button>
            <button onClick={async () => {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
                // WebRTC stream sending logic...
            }}>Start Webcam</button>
            <TranscriptionDisplay transcription={transcription} />
            <CodeEditor onCodeChange={setCode} />
            {/* ... other UI elements */}
        </div>
    );
};

export default StreamerInterface;