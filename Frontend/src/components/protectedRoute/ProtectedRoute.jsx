import React from "react";
import { Navigate } from "react-router-dom";
// import { useAuthStore } from "../store/useAuthStore.js";

const ProtectedRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <div>Loading...</div>; // Or spinner
  }

  if (!authUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
