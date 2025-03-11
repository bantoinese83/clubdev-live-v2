import React, {useMemo} from 'react';

interface CashTagDisplayProps {
    cashTags: string;
    className?: string;
}

const CashTagDisplay: React.FC<CashTagDisplayProps> = ({cashTags, className = ''}) => {
    const formattedTags = useMemo(() => {
        if (!cashTags?.trim()) {
            return [];
        }

        return cashTags
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean)
            .map(tag => {
                // Convert to clickable links if they contain valid URLs or handles
                if (tag.startsWith('http://') || tag.startsWith('https://')) {
                    return {type: 'url', value: tag, display: tag};
                } else if (tag.startsWith('@')) {
                    return {type: 'handle', value: tag, display: tag};
                } else if (tag.includes('.com/') || tag.includes('.me/')) {
                    return {type: 'url', value: `https://${tag}`, display: tag};
                }
                return {type: 'text', value: tag, display: tag};
            });
    }, [cashTags]);

    if (!formattedTags.length) {
        return null;
    }

    const containerStyle: React.CSSProperties = {
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        marginBottom: '16px',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '1rem',
        fontWeight: 'bold',
        marginBottom: '8px',
        color: '#333',
    };

    const tagsContainerStyle: React.CSSProperties = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
    };

    const tagStyle: React.CSSProperties = {
        padding: '4px 8px',
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
        fontSize: '0.9rem',
        color: '#2563eb',
        transition: 'background-color 0.2s',
    };

    return (
        <div
            style={containerStyle}
            className={className}
            role="complementary"
            aria-label="Streamer support information"
        >
            <h2 style={titleStyle}>Support the Streamer</h2>
            <div style={tagsContainerStyle}>
                {formattedTags.map((tag, index) => (
                    tag.type === 'url' ? (
                        <a
                            key={index}
                            href={tag.value}
                            style={tagStyle}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            {tag.display}
                        </a>
                    ) : (
                        <span
                            key={index}
                            style={tagStyle}
                        >
                                    {tag.display}
                                </span>
                    )
                ))}
            </div>
        </div>
    );
};

export default React.memo(CashTagDisplay);