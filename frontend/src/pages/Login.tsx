import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Send data to our new backend route
      const res = await axios.post('http://localhost:5001/api/auth/login', formData);
      
      // 2. Save the token in LocalStorage (The "Browser's Wallet")
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));

      // 3. Redirect to the dashboard or home
      navigate('/');
      alert('Login Successful!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login to OpenHand</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Email" 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
          required 
        />
        <br />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          required 
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
