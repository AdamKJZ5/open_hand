import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

interface Opportunity {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: string;
}

const Dashboard = () => {
  const navigate = useNavigate(); 
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpps = async () => {
      try {
        setLoading(true);
        const res = await API.get('/opportunities');
        setOpportunities(res.data);
      } catch (error: any) {
        console.error("Error fetching opportunities:", error);
        if (error.response?.status === 401) {
          navigate('/login'); 
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOpps();
  }, [navigate]);
   
  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const res = await API.get('/opportunities'); // This now automatically sends your token!
        setOpportunities(res.data);
      } catch (err) {
        console.log("Not authorized!");
        navigate('/login');
      }
    };
    fetchProtectedData();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading opportunities...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Available Opportunities</h1>
      
      {opportunities.length === 0 ? (
        <p>No opportunities available at the moment. Check back later!</p>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {opportunities.map((opp) => (
            <div 
              key={opp._id} 
              style={{ 
                border: '1px solid #ddd', 
                padding: '1.5rem', 
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                backgroundColor: '#fff' 
              }}
            >
              <h3 style={{ marginTop: 0, color: '#2d3748' }}>{opp.title}</h3>
              <p style={{ color: '#4a5568' }}>{opp.description}</p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#718096' }}>
                <span>📍 {opp.location}</span>
                <span>📅 {opp.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
