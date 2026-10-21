import { Navigate } from 'react-router';

function ProtectedRoute({ user, role, children }) {
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/menu" />;
  return children;
}

export default ProtectedRoute;
