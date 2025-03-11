import React, {useEffect, useRef, useState} from 'react';
import VideoDisplay from './VideoDisplay';
import TranscriptionDisplay from './TranscriptionDisplay';
import CodeEditor from './CodeEditor';
import CashTagDisplay from './CashTagDisplay';
import RoomIdDisplay from './RoomIdDisplay';
import io from 'socket.io-client';
import {Socket} from 'socket.io-client';

interface ViewerInterfaceProps {
    roomId: string;
}

const ViewerInterface: React.FC<ViewerInterfaceProps> = ({roomId}) => {
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [transcription, setTranscription] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [streamerProfile, setStreamerProfile] = useState<{ name: string; cashTags: string }>({
        name: '',
        cashTags: ''
    });

    const socketRef = useRef<Socket | null>(null);
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

    useEffect(() => {
        socketRef.current = io('http://localhost:3001');
        const peerConnection = new RTCPeerConnection({
            iceServers: [{urls: 'stun:stun.l.google.com:19302'}]
        });
        peerConnectionRef.current = peerConnection;

        socketRef.current.emit('join-room', roomId);

        peerConnection.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        socketRef.current.on('offer', async (offer) => {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            socketRef.current?.emit('answer', answer, roomId);
        });

        socketRef.current.on('transcription-update', (text: string) => {
            setTranscription(text);
        });

        socketRef.current.on('code-update', (newCode: string) => {
            setCode(newCode);
        });

        socketRef.current.on('streamer-profile', (profile: { name: string; cashTags: string }) => {
            setStreamerProfile(profile);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            if (remoteStream) {
                remoteStream.getTracks().forEach(track => track.stop());
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
        };
    }, [roomId]);

    return (
        <div>
            <h2>Viewer View - Room: <RoomIdDisplay roomId={roomId}/></h2>
            <CashTagDisplay cashTags={streamerProfile.cashTags}/>
            <VideoDisplay videoStream={remoteStream} videoRef={remoteVideoRef} isLocal={false}/>
            <TranscriptionDisplay transcription={transcription}/>
            <CodeEditor code={code} readOnly/>
        </div>
    );
};

export default ViewerInterface;