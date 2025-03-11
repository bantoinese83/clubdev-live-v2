import React, { useEffect, useRef, useState } from 'react';
import VideoDisplay from './VideoDisplay.jsx';
import CodeEditor from './CodeEditor.jsx';
import TranscriptionDisplay from './TranscriptionDisplay.jsx';
import ProfileSetup from './ProfileSetup.jsx';
import CashTagDisplay from './CashTagDisplay.jsx';
import RoomIdDisplay from './RoomIdDisplay.jsx';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';

interface StreamerInterfaceProps {
    roomId: string;
}

const StreamerInterface: React.FC<StreamerInterfaceProps> = ({ roomId }) => {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [transcription, setTranscription] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [profile, setProfile] = useState<{ name: string; cashTags: string }>({ name: '', cashTags: '' });

    const socketRef = useRef<Socket | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

    const initializeSpeechRecognition = () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new (window as any).webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onresult = (event: any) => {
                const transcript = Array.from(event.results)
                    .map((result: any) => result[0].transcript)
                    .join('');
                setTranscription(transcript);
                socketRef.current?.emit('transcription-update', transcript, roomId);
            };

            recognition.start();
            return recognition;
        }
        return null;
    };

    const initializePeerConnection = (stream: MediaStream) => {
        const peerConnection = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        stream.getTracks().forEach(track => {
            peerConnection.addTrack(track, stream);
        });

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                socketRef.current?.emit('ice-candidate', event.candidate, roomId);
            }
        };

        peerConnectionRef.current = peerConnection;
        return peerConnection;
    };

    useEffect(() => {
        socketRef.current = io('http://localhost:3001');
        socketRef.current.emit('join-room', roomId);

        const recognition = initializeSpeechRecognition();

        socketRef.current.on('viewer-connected', async () => {
            if (localStream && peerConnectionRef.current) {
                const offer = await peerConnectionRef.current.createOffer();
                await peerConnectionRef.current.setLocalDescription(offer);
                socketRef.current?.emit('offer', offer, roomId);
            }
        });

        socketRef.current.on('answer', async (answer) => {
            if (peerConnectionRef.current) {
                await peerConnectionRef.current.setRemoteDescription(answer);
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
            if (recognition) {
                recognition.stop();
            }
        };
    }, [roomId, localStream]);

    const startStreaming = async (getStreamFn: () => Promise<MediaStream>) => {
        try {
            const stream = await getStreamFn();
            setLocalStream(stream);
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            const peerConnection = initializePeerConnection(stream);
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            socketRef.current?.emit('offer', offer, roomId);
        } catch (error) {
            console.error('Error starting stream:', error);
        }
    };

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
        socketRef.current?.emit('code-update', newCode, roomId);
    };

    const handleProfileUpdate = (newProfile: { name: string; cashTags: string }) => {
        setProfile(newProfile);
        socketRef.current?.emit('streamer-profile', newProfile, roomId);
    };

    return (
        <div>
            <h2>Streamer View - Room: <RoomIdDisplay roomId={roomId} /></h2>
            <ProfileSetup onProfileUpdate={handleProfileUpdate} />
            <CashTagDisplay cashTags={profile.cashTags} />
            <VideoDisplay videoStream={localStream} videoRef={localVideoRef} isLocal />
            <button onClick={() => startStreaming(() =>
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true }))}>
                Share Screen
            </button>
            <button onClick={() => startStreaming(() =>
                navigator.mediaDevices.getUserMedia({ video: true, audio: true }))}>
                Start Webcam
            </button>
            <TranscriptionDisplay transcription={transcription} />
            <CodeEditor code={code} onCodeChange={handleCodeChange} />
        </div>
    );
};

export default StreamerInterface;
