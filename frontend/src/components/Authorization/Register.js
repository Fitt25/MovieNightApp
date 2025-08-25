import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/register', {
        email: form.email,
        password: form.password,
      });

      if (res.status === 201 || res.data.message === 'User created') {
        setSuccess('Account created! You can now log in.');
        setError('');
        setForm({ email: '', password: '', confirmPassword: '' });
      }
    } catch (err) {
      setError('Sign Up failed. Try again.');
      setSuccess('');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSignup}>
        <h2>Sign Up</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
        />
        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Register;