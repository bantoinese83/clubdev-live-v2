import React, { useEffect, useRef, useState } from 'react';
import VideoDisplay from './VideoDisplay';
import TranscriptionDisplay from './TranscriptionDisplay';
import CodeEditor from './CodeEditor';
import CashTagDisplay from './CashTagDisplay';
import RoomIdDisplay from './RoomIdDisplay';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';

interface ViewerInterfaceProps {
    roomId: string;
}

const ViewerInterface: React.FC<ViewerInterfaceProps> = ({ roomId }) => {
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [transcription, setTranscription] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [streamerProfile, setStreamerProfile] = useState<{ name: string; cashTags: string }>({ name: '', cashTags: '' });

    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        socketRef.current = io('http://localhost:3001'); // Replace with your signaling server URL

        socketRef.current.emit('join-room', roomId);

        // WebRTC, Transcription, Code, Profile receiving logic will go here
        // ... (See detailed steps below)

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            if (remoteStream) {
                remoteStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [roomId]);


    return (
        <div>
            <h2>Viewer View - Room: <RoomIdDisplay roomId={roomId} /></h2>
            <CashTagDisplay cashTags={streamerProfile.cashTags} />
            <VideoDisplay videoStream={remoteStream} videoRef={remoteVideoRef} isLocal={false} />
            <TranscriptionDisplay transcription={transcription} />
            <CodeEditor code={code} readOnly /> {/* Viewer's CodeEditor is read-only */}
            {/* ... other UI elements */}
        </div>
    );
};

export default ViewerInterface;
