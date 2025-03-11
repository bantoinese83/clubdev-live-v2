import React, {useEffect, useState} from 'react';

interface VideoDisplayProps {
    videoStream: MediaStream | null;
    videoRef: React.RefObject<HTMLVideoElement>;
    isLocal: boolean;
    width?: string | number;
    height?: string | number;
    className?: string;
}

interface VideoStyles {
    container: React.CSSProperties;
    video: React.CSSProperties;
    errorMessage: React.CSSProperties;
    loadingSpinner: React.CSSProperties;
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({
                                                       videoStream,
                                                       videoRef,
                                                       isLocal,
                                                       width = '100%',
                                                       height = 'auto',
                                                       className = ''
                                                   }) => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!videoRef.current) return;

        const videoElement = videoRef.current;

        const handleError = (e: Event) => {
            console.error('Video error:', e);
            setError('Failed to load video stream');
            setIsLoading(false);
        };

        const handleLoadedMetadata = () => {
            setIsLoading(false);
            setError(null);
        };

        const handleLoadStart = () => {
            setIsLoading(true);
            setError(null);
        };

        try {
            if (videoStream) {
                videoElement.srcObject = videoStream;
            } else {
                videoElement.srcObject = null;
                setError('No video stream available');
            }
        } catch (err) {
            console.error('Error setting video stream:', err);
            setError('Failed to set video stream');
        }

        videoElement.addEventListener('error', handleError);
        videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.addEventListener('loadstart', handleLoadStart);

        return () => {
            videoElement.removeEventListener('error', handleError);
            videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
            videoElement.removeEventListener('loadstart', handleLoadStart);

            if (videoElement.srcObject instanceof MediaStream) {
                const tracks = videoElement.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
            videoElement.srcObject = null;
        };
    }, [videoStream, videoRef]);

    const styles: VideoStyles = {
        container: {
            position: 'relative',
            border: '1px solid #ccc',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '10px',
            backgroundColor: '#000',
            width,
            height,
            minHeight: '200px',
        },
        video: {
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transform: isLocal ? 'scaleX(-1)' : 'none',
        },
        errorMessage: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#ff4444',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '10px 20px',
            borderRadius: '4px',
            textAlign: 'center',
        },
        loadingSpinner: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
        }
    };

    return (
        <div style={styles.container} className={className}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={isLocal}
                style={{
                    ...styles.video,
                    display: error || isLoading ? 'none' : 'block'
                }}
            />
            {error && (
                <div style={styles.errorMessage}>
                    {error}
                </div>
            )}
            {isLoading && !error && (
                <div style={styles.loadingSpinner}/>
            )}
            <style>
                {`
                    @keyframes spin {
                        0% { transform: translate(-50%, -50%) rotate(0deg); }
                        100% { transform: translate(-50%, -50%) rotate(360deg); }
                    }
                    `}
            </style>
        </div>
    );
};

export default VideoDisplay;