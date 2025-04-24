import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { state } = useAuth();
  const location = useLocation();

  if (!state.isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;