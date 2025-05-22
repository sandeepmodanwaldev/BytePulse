import React from "react";
// import { useAuthStore } from "../store/useAuthStore.js";
import { Outlet, Navigate } from "react-router-dom";

const AdminRoute = () => {
  const { authUser } = useAuthStore();

  if (!authUser || authUser.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
export default AdminRoute;
