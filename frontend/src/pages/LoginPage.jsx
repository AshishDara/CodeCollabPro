// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Logo from '../components/Logo'; // Our new, unique SVG Logo

const LoginPage = () => {
    // Hook to programmatically navigate between routes
    const navigate = useNavigate();

    // State to hold the form input values
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Function to handle form submission
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent the default browser refresh
        try {
            // Send a POST request to our backend login endpoint
            const { data } = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
                { email, password }
            );

            // On success, save the returned user info (including token) to localStorage
            localStorage.setItem('userInfo', JSON.stringify(data));

            toast.success('Login successful!');
            // Redirect the user to their dashboard
            navigate('/dashboard');
        } catch (error) {
            // Display any errors returned from the backend
            toast.error(error.response?.data?.message || 'Login failed.');
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="auth-form-wrapper">
                <div className="auth-form-logo-container">
                    <Logo />
                </div>
                <h4 className="mainLabel">Login to Your Account</h4>
                <form onSubmit={handleLogin} className="auth-input-group">
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
                        Login
                    </button>
                    <p className="auth-form-footer">
                        Don't have an account?&nbsp;
                        <Link to="/register">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;