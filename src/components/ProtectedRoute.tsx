import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  requiredRole?: 'Admin' | 'Member';
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="page-wrapper container" style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}><h2>Loading...</h2></div>;
  }

  // If not logged in at all
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role is required and doesn't match
  if (requiredRole && user.role !== requiredRole && user.role !== 'Admin') {
    // Admin can access Member pages usually, but just in case
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
