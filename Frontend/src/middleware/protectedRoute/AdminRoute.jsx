import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const AdminRoute = () => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return (
      <>
        {" "}
        <div className="flex items-center justify-center h-screen bg-base-200">
          <div className="card bg-base-100 p-8 shadow-xl items-center">
            <span className="loading loading-spinner loading-lg  text-primary"></span>
            <p className="mt-4 text-base-content/70">Loading problem...</p>
          </div>
        </div>
      </>
    );
  }

  if (authUser.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
export default AdminRoute;
