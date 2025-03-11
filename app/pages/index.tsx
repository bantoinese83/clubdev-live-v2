// pages/index.tsx
                import React from 'react';
                import { useRouter } from 'next/router';
                import { v4 as uuidv4 } from 'uuid';

                const HomePage: React.FC = () => {
                    const router = useRouter();

                    const handleCreateRoom = () => {
                        const roomId = uuidv4();
                        router.push(`/room/${roomId}`);
                    };

                    const containerStyle: React.CSSProperties = {
                        textAlign: 'center',
                        padding: '50px',
                    };

                    const buttonStyle: React.CSSProperties = {

                        padding: '10px 20px',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                    };

                    return (
                        <div style={containerStyle}>
                            <h1>Welcome to ClubDev Live</h1>
                            <p>Start coding live in public!</p>
                            <button
                                style={buttonStyle}
                                onClick={handleCreateRoom}
                            >
                                Create New Room
                            </button>
                        </div>
                    );
                };

                export default HomePage;