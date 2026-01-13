import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Wait for auth check
  if (loading) {
    return <div className="p-6">Checking authentication...</div>;
  }

  // If already logged in → redirect away
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
