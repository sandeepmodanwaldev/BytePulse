import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const AdminRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  if (authUser.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
export default AdminRoute;
