import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const fetchOpps = async () => {
      const res = await axios.get('http://localhost:5001/api/opportunities');
      setOpportunities(res.data);
    };
    fetchOpps();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Available Opportunities</h1>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {opportunities.map((opp: any) => (
          <div key={opp._id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <h3>{opp.title}</h3>
            <p>{opp.description}</p>
            <small>📍 {opp.location} | 📅 {opp.date}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
