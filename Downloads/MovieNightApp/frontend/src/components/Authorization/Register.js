import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/register', { email, password });
            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
                setError('');
                setIsAuthenticated(true);
                alert('Registration succesful!');
            }
        } catch (err) {
            setError('User already exists or invalid data.');
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Email: </label>
                    <input
                        type = "email"
                        value = {email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                </div>
                <div>
                <label>Password: </label>
                    <input
                        type = "password"
                        value = {password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>
                <button type="submit">Sign Up</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Register;