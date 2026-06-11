import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ADMIN_ROLES } from '../utils/constants';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && !ADMIN_ROLES.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
