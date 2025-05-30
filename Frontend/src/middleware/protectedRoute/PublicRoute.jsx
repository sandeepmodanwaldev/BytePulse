import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const PublicRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  if (authUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
