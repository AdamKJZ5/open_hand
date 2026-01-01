import React, { useState } from 'react';
import API from '../api';

const Register = () => {
  // 1. Setup State for the form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { name, email, password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await API.post('/auth/register', formData);    
      console.log('✅ Success! Backend says:', response.data);

    } catch (err: any) {
      console.error('❌ Error sending to backend:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Registration failed');
    } 
  };

  return (
    <div className="register-container">
      <h1>Create an Account</h1>
      <form onSubmit={onSubmit}>
        <input 
          type="text" name="name" placeholder="Name" 
          value={name} onChange={onChange} required 
        />
        <input 
          type="email" name="email" placeholder="Email" 
          value={email} onChange={onChange} required 
        />
        <input 
          type="password" name="password" placeholder="Password" 
          value={password} onChange={onChange} required 
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
