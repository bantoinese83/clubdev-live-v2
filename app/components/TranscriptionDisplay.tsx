import React, {useEffect, useRef} from 'react';

interface TranscriptionDisplayProps {
    transcription: string;
    maxLength?: number;
    autoScroll?: boolean;
    className?: string;
}

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
                                                                       transcription,
                                                                       maxLength = 1000,
                                                                       autoScroll = true,
                                                                       className = ''
                                                                   }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const truncatedText = transcription.slice(-maxLength);

    useEffect(() => {
        if (autoScroll && containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [transcription, autoScroll]);

    const containerStyle: React.CSSProperties = {
        border: '1px solid #ccc',
        padding: '15px',
        borderRadius: '8px',
        height: '150px',
        overflowY: 'auto',
        backgroundColor: '#fff',
        marginBottom: '15px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        position: 'relative',
    };

    const transcriptionStyle: React.CSSProperties = {
        margin: 0,
        lineHeight: '1.5',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
    };

    const placeholderStyle: React.CSSProperties = {
        color: '#666',
        fontStyle: 'italic',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    };

    const scrollIndicatorStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: '5px',
        right: '5px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: '#fff',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        opacity: autoScroll ? 0 : 1,
    };

    const handleScroll = () => {
        if (!containerRef.current) return;

        const {scrollHeight, scrollTop, clientHeight} = containerRef.current;
        const isScrolledToBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 1;

        if (containerRef.current.querySelector('.scroll-indicator')) {
            containerRef.current.querySelector('.scroll-indicator')!.style.opacity =
                isScrolledToBottom ? '0' : '1';
        }
    };

    return (
        <div
            ref={containerRef}
            style={containerStyle}
            className={`transcription-display ${className}`}
            onScroll={handleScroll}
            role="log"
            aria-live="polite"
            aria-atomic="true"
        >
            {truncatedText ? (
                <p style={transcriptionStyle}>
                    {truncatedText}
                </p>
            ) : (
                <div style={placeholderStyle}>
                    Waiting for transcription...
                </div>
            )}
            {!autoScroll && truncatedText && (
                <div
                    className="scroll-indicator"
                    style={scrollIndicatorStyle}
                    role="status"
                >
                    New text below
                </div>
            )}
            <style>
                {`
                            .transcription-display::-webkit-scrollbar {
                                width: 8px;
                            }
                            .transcription-display::-webkit-scrollbar-track {
                                background: #f1f1f1;
                                border-radius: 4px;
                            }
                            .transcription-display::-webkit-scrollbar-thumb {
                                background: #888;
                                border-radius: 4px;
                            }
                            .transcription-display::-webkit-scrollbar-thumb:hover {
                                background: #555;
                            }
                        `}
            </style>
        </div>
    );
};

export default TranscriptionDisplay;