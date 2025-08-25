// src/components/Editor.jsx
import React, { useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { lineNumbers } from '@codemirror/view';


const Editor = ({ socketRef, documentId, onCodeChange }) => {
    const [code, setCode] = useState('');

    // This effect listens for code changes from the server
    useEffect(() => {
        if (socketRef.current) {
            // Listen for 'receive-changes' from the server
            socketRef.current.on('receive-changes', (newCode) => {
                if (newCode !== null) {
                    setCode(newCode);
                }
            });
        }

        // Cleanup: remove the listener when the component unmounts
        return () => {
            if (socketRef.current) {
                socketRef.current.off('receive-changes');
            }
        };
    }, [socketRef.current]);

    // This function is called whenever the user types in the editor
    const handleCodeChange = (newCode) => {
        setCode(newCode);
        onCodeChange(newCode); // Pass the code up to the parent component
        if (socketRef.current) {
            // Emit 'send-changes' to the server
            socketRef.current.emit('send-changes', {
                documentId,
                content: newCode,
            });
        }
    };

    return (
        <CodeMirror
            value={code}
            
            theme={dracula}
            extensions={[javascript({ jsx: true }), lineNumbers()]}
            onChange={handleCodeChange}
            style={{ fontSize: '16px' }}
        />
    );
};

export default Editor;