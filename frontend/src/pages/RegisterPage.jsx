// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Logo from '../components/Logo'; 

const RegisterPage = () => {
    // Hook to programmatically navigate between routes
    const navigate = useNavigate();

    // State to hold the form input values
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Function to handle form submission
    const handleRegister = async (e) => {
        e.preventDefault(); // Prevent the default browser refresh on form submission
        try {
            // Send a POST request to our backend register endpoint
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
                name,
                email,
                password,
            });
            toast.success('Registration successful! Please log in.');
            // On success, redirect the user to the login page
            navigate('/login');
        } catch (error) {
            // Display any errors returned from the backend
            toast.error(error.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-form-wrapper">
                <div className="auth-form-logo-container">
                    <Logo />
                </div>
                <h4 className="mainLabel">Create an Account</h4>
                <form onSubmit={handleRegister} className="auth-input-group">
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        className="inputBox"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="inputBox"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn joinBtn">
                        Register
                    </button>
                    <p className="auth-form-footer">
                        Already have an account?&nbsp;
                        <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;