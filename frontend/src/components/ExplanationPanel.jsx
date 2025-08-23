// src/components/ExplanationPanel.jsx
import React from 'react';
import ReactMarkdown from 'react-markdown';

// This component now acts as a replacement sidebar
const ExplanationPanel = ({ isLoading, response, onClose }) => {
    return (
        // Use an <aside> element with a new class name for styling
        <aside className="explanation-panel">
            <div className="panel-header">
                <h3>AI Code Explanation</h3>
                <button onClick={onClose} className="btn close-btn">
                    &times;
                </button>
            </div>
            <div className="panel-body">
                {/* Show a loading message while waiting for the AI */}
                {isLoading && <p>Analyzing your code...</p>}

                {/* Display the response once it arrives */}
                {!isLoading && response && (
                    <>
                        <h4>Explanation:</h4>
                        <ReactMarkdown>{response.explanation}</ReactMarkdown>

                        <h4>Key Concepts:</h4>
                        <div className="concept-tags">
                            {response.keyConcepts.map((concept, index) => (
                                <span key={index} className="concept-tag">
                                    {concept}
                                </span>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </aside>
    );
};

export default ExplanationPanel;