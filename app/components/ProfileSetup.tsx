// components/ProfileSetup.tsx
import React, { useState, useCallback } from 'react';

interface ProfileSetupProps {
    onProfileUpdate: (profile: { name: string; cashTags: string }) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onProfileUpdate }) => {
    const [name, setName] = useState('');
    const [cashTags, setCashTags] = useState('');

    const handleSubmit = useCallback(
        (event: React.FormEvent) => {
            event.preventDefault();
            const profileData = { name, cashTags };
            sessionStorage.setItem('streamerProfile', JSON.stringify(profileData)); // Store in session storage
            onProfileUpdate(profileData);
            alert('Profile updated!'); // Simple feedback
        },
        [name, cashTags, onProfileUpdate]
    );

    // Basic form styling
    const formStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '300px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        marginBottom: '20px',
    };

    const inputStyle: React.CSSProperties = {
        marginBottom: '10px',
        padding: '8px',
        borderRadius: '3px',
        border: '1px solid #ddd',
    };

    const buttonStyle: React.CSSProperties = {
        padding: '8px 15px',
        borderRadius: '3px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    };

    return (
        <form style={formStyle} onSubmit={handleSubmit}>
            <h2>Set Up Your Profile</h2>
            <label htmlFor="name">Your Name:</label>
            <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                required
            />
            <label htmlFor="cashTags">Cash Tags (e.g., @CashApp, venmo.com/user):</label>
            <input
                type="text"
                id="cashTags"
                value={cashTags}
                onChange={(e) => setCashTags(e.target.value)}
                style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>Save Profile</button>
        </form>
    );
};

export default ProfileSetup;