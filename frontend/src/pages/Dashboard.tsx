import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './dashboards/AdminDashboard';
import FamilyDashboard from './dashboards/FamilyDashboard';
import CaretakerDashboard from './dashboards/CaretakerDashboard';
import DefaultDashboard from './dashboards/DefaultDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role || '');
      } catch (error) {
        // Error parsing user data - redirect to login
        navigate('/login');
      }
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E8EDE7] to-[#F5F1E8] flex items-center justify-center">
        <div className="text-2xl font-bold text-[#4A6741]">✨ Loading dashboard...</div>
      </div>
    );
  }

  // Route to role-specific dashboard
  switch (userRole) {
    case 'admin':
      return <AdminDashboard />;
    case 'family':
      return <FamilyDashboard />;
    case 'caretaker':
      return <CaretakerDashboard />;
    case 'default':
      return <DefaultDashboard />;
    default:
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#E8EDE7] to-[#F5F1E8] flex items-center justify-center p-4">
          <div className="bg-[#F5F1E8] rounded-2xl shadow-xl p-8 max-w-md text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">You don't have permission to access the dashboard.</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-[#4A6741] to-[#7C9A7F] text-white rounded-full font-bold hover:from-[#3A5531] hover:to-[#6C8A6F] transition-all"
            >
              Go Home
            </button>
          </div>
        </div>
      );
  }
};

export default Dashboard;
