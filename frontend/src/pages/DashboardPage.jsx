// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';

const DashboardPage = () => {
    // Hooks for navigation and state management
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [joinId, setJoinId] = useState('');

    // State for the document creation modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');

    // This effect runs once when the component mounts to load data
    useEffect(() => {
        // Load user info from browser's localStorage
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            const parsedInfo = JSON.parse(storedUserInfo);
            setUserInfo(parsedInfo);
            // Fetch documents associated with this user
            fetchDocuments(parsedInfo.token);
        } else {
            // If no user info is found, redirect to the login page
            toast.error('You must be logged in.');
            navigate('/login');
        }
    }, [navigate]); // Dependency array ensures this runs only once on mount

    // Function to fetch documents from the backend
    const fetchDocuments = async (token) => {
        try {
            // Make a GET request to our protected document endpoint
            const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/docs`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the JWT for authorization
                },
            });
            setDocuments(data); // Update state with the fetched documents
        } catch (error) {
            toast.error('Could not fetch documents.');
        }
    };

    // Function to handle joining a document
    const handleJoinDocument = async () => {
        if (!joinId) {
            return toast.error('Please enter a Document ID.');
        }
        try {
            // First, call the backend to register as a collaborator
            await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/docs/${joinId}/collaborators`,
                {}, // Empty body
                { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );

            // Only if the API call is successful, navigate to the editor
            toast.success('Joining document...');
            navigate(`/editor/${joinId}`);
        } catch (error) {
            // If the backend returns an error (e.g., document not found), show it
            toast.error(error.response?.data?.message || 'Failed to join document.');
        }
    };

    // Function to handle creating a new document via the modal
    const handleCreateDocument = async () => {
        if (!newTitle) {
            return toast.error('Title is required.');
        }
        try {
            // Send a POST request with the new title to the backend
            const { data: newDocument } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/docs`,
                { title: newTitle }, // The request body
                { headers: { Authorization: `Bearer ${userInfo.token}` } }
            );
            toast.success('New document created!');
            setIsModalOpen(false); // Close the modal on success
            setNewTitle(''); // Reset the title input for next time
            navigate(`/editor/${newDocument._id}`); // Navigate to the new document's editor
        } catch (error) {
            toast.error('Could not create a new document.');
        }
    };

    return (
        <>
            {/* The Modal for creating a new document */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="auth-input-group">
                    <h3 className="mainLabel" style={{ marginBottom: '1rem' }}>Create New Document</h3>
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="Enter document title..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <button onClick={handleCreateDocument} className="btn joinBtn">
                        Create
                    </button>
                </div>
            </Modal>

            {/* The main dashboard layout */}
            <div className="dashboard-page-wrapper">
                <div className="dashboard-header">
                    <h1>Welcome, {userInfo?.name}!</h1>
                    <div className="dashboard-actions">
                        <div className="join-doc-group">
                            <input
                                type="text"
                                className="inputBox"
                                placeholder="Enter Document ID to Join"
                                value={joinId}
                                onChange={(e) => setJoinId(e.target.value)}
                            />
                            <button onClick={handleJoinDocument} className="btn">
                                Join
                            </button>
                        </div>
                        {/* This button now opens the creation modal */}
                        <button onClick={() => setIsModalOpen(true)} className="btn joinBtn">
                            + Create New Document
                        </button>
                    </div>
                </div>

                <h2>Your Documents</h2>
                {/* Conditionally render the document list or a message if no documents exist */}
                {documents.length > 0 ? (
                    <div className="document-list">
                        {documents.map((doc) => (
                            <Link to={`/editor/${doc._id}`} key={doc._id} className="document-card">
                                <h3>{doc.title}</h3>
                                <p>Last updated: {new Date(doc.updatedAt).toLocaleDateString()}</p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p>You have no documents yet. Create one to get started!</p>
                )}
            </div>
        </>
    );
};

export default DashboardPage;