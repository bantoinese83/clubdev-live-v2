// components/VideoDisplay.tsx
import React, { useRef, useEffect } from 'react';

interface VideoDisplayProps {
    videoStream: MediaStream | null;
    videoRef: React.RefObject<HTMLVideoElement>;
    isLocal: boolean; // To differentiate local/remote video if needed for styling
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({ videoStream, videoRef, isLocal }) => {
    useEffect(() => {
        if (videoRef.current && videoStream) {
            videoRef.current.srcObject = videoStream;
        }
    }, [videoStream, videoRef]);

    // Basic video container styling
    const containerStyle: React.CSSProperties = {
        border: '1px solid #ccc',
        borderRadius: '5px',
        overflow: 'hidden', // To keep video within rounded borders
        marginBottom: '10px',
        backgroundColor: '#000', // Black background for video area
    };

    const videoStyle: React.CSSProperties = {
        display: 'block', // Ensure video fills container and no extra space
        width: '100%',
        height: 'auto', // Maintain aspect ratio
    };


    return (
        <div style={containerStyle}>
            <video ref={videoRef} autoPlay muted={isLocal} style={videoStyle} />
        </div>
    );
};

export default VideoDisplay;