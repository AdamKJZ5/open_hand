import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'caretaker' | 'family';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  // Check if user is authenticated
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  // Check if role is required
  if (requiredRole) {
    try {
      const user = JSON.parse(userStr);

      // Check if user has the required role
      if (user.role !== requiredRole) {
        // Redirect to dashboard if user doesn't have the required role
        return <Navigate to="/dashboard" replace />;
      }
    } catch (error) {
      // If there's an error parsing user data, redirect to login
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
