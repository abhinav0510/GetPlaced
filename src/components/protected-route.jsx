/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded, user } = useAuth();
  const { pathname } = useLocation();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Navigate to="/?sign-in=true" />;
  }

  if (
    user !== undefined &&
    !user?.unsafeMetadata?.role &&
    pathname !== "/onboarding"
  ) {
    return <Navigate to="/onboarding" />;
  }

  // Mandatory Recruiter Profile Completion Check before posting a job
  if (
    user?.unsafeMetadata?.role === "recruiter" &&
    user?.profileCompleted !== true &&
    pathname === "/post-job"
  ) {
    return <Navigate to="/my-profile?complete-profile=true" />;
  }

  // Prevent recruiters from accessing candidate job search page or saved jobs
  if (
    user?.unsafeMetadata?.role === "recruiter" &&
    (pathname === "/jobs" || pathname === "/saved-jobs")
  ) {
    return <Navigate to="/my-jobs" />;
  }

  return children;
};

export default ProtectedRoute;

