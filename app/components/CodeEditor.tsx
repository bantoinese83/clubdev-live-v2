import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';

interface CodeEditorProps {
    code?: string; // Initial code, optional
    onCodeChange?: (newCode: string) => void; // Callback for code changes, optional
    readOnly?: boolean; // Whether the editor should be read-only
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code = '', onCodeChange, readOnly = false }) => {
    const [localCode, setLocalCode] = useState<string>(code);

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            setLocalCode(value);
            if (onCodeChange) {
                onCodeChange(value);
            }
        }
    };

    const editorOptions = {
        selectOnLineNumbers: true,
        readOnly: readOnly,
        automaticLayout: true, // Important for layout within resizable containers
    };

    // Basic container styling - adjust as needed
    const containerStyle: React.CSSProperties = {
        border: '1px solid #ccc',
        height: '300px', // Or adjust height as needed
        marginBottom: '10px',
    };

    return (
        <div style={containerStyle}>
            <MonacoEditor
                width="100%"
                height="100%"
                language="javascript" // Default language, can be prop if needed
                theme="vs-dark" // Or "vs-light", "hc-black"
                value={localCode}
                options={editorOptions}
                onChange={handleEditorChange}
            />
        </div>
    );
};

export default CodeEditor;
