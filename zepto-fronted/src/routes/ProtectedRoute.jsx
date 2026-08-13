import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userType)) {
    // If user is logged in but doesn't have the right role, 
    // redirect to index or an unauthorized page
    return <Navigate to="/index" replace />;
  }

  return children;
};

export default ProtectedRoute;
