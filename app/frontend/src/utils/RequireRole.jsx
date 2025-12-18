import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * Industry-standard frontend route guard
 * - Blocks unauthorized users
 * - Prevents UI flicker
 * - Reusable for any role
 */
const RequireRole = ({ allowedRoles, children }) => {
  const { profile, authChecked } = useSelector((state) => state.auth);

  // Wait until auth is checked (prevents flicker)
  if (!authChecked) return null; // or loader

  // Not logged in or role not allowed
  if (!profile || !allowedRoles.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireRole;
