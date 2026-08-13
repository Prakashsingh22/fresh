import { Navigate } from "react-router-dom";
import { getUser, isLoggedIn } from "../utils/auth";

const LandingRedirect = () => {
  if (!isLoggedIn()) return <Navigate to="/search/product" replace />;

  const user = getUser();
  const userType = user?.userType;

  if (userType === "CONSUMER") return <Navigate to="/search/product" replace />;
  if (
    userType === "MEINT" ||
    userType === "ZEPTO_APP_ADMIN" ||
    userType === "WAREHOUSE_ADMIN"
  )
    return <Navigate to="/index" replace />;

  return <Navigate to="/login" replace />;
};

export default LandingRedirect;
