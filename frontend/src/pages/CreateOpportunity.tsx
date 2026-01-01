import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const CreateOpportunity = () => {
  const [formData, setFormData] = useState({ title: '', description: '', location: '', date: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/opportunities', formData);
      alert('Opportunity Created!');
      navigate('/dashboard');
    } catch (err) {
      alert('Error creating opportunity');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Post a Volunteer Need</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input type="text" placeholder="Title" onChange={(e) => setFormData({...formData, title: e.target.value})} required />
        <textarea placeholder="Description" onChange={(e) => setFormData({...formData, description: e.target.value})} required />
        <input type="text" placeholder="Location (e.g. Seattle, WA)" onChange={(e) => setFormData({...formData, location: e.target.value})} required />
        <input type="date" onChange={(e) => setFormData({...formData, date: e.target.value})} required />
        <button type="submit" style={{ padding: '0.7rem', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
          Post Opportunity
        </button>
      </form>
    </div>
  );
};

export default CreateOpportunity;
