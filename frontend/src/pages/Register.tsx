import React, { useState } from 'react';
import axios from 'axios';
const Register = () => {
  // 1. Setup State for the form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { name, email, password } = formData;

  // 2. Handle input changes
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
    
      const response = await axios.post('http://localhost:5001/api/auth/register', formData);

      console.log('✅ Success! Backend says:', response.dat);

    } catch (err: any) {
      console.error('❌ Error sending to backend:', err.response?.data || err.message);
      alert('Registration failed. Check the console for details.')
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
