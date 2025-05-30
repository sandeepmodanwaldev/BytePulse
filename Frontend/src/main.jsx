import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

//import

import ProtectedRoute from "./middleware/protectedRoute/ProtectedRoute.jsx";
import AdminRoute from "./middleware/protectedRoute/AdminRoute.jsx";
import PublicRoute from "./middleware/protectedRoute/PublicRoute.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import SignUpPage from "./pages/Auth/SignUpPage.jsx";
import ProblemPage from "./pages/ProblemPage.jsx";
import AddProblem from "./pages/AddProblem.jsx";
import HomePage from "./pages/landing/HomePage.jsx";

import LogoutPage from "./pages/Auth/LogoutPage.jsx";
import VerifyemailPage from "./pages/Auth/VerifyemailPage.jsx";
import ForgetPasswordPage from "./pages/Auth/ForgetPasswordPage.jsx";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProtectedLayout from "./layout/ProtectedLayout.jsx";
import PublicLayout from "./layout/PublicLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PlaylistDetailsPage from "./pages/PlaylistPage.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public Layout + Public Route */}
      <Route element={<App />}>
        <Route element={<PublicLayout />}>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route
              path="/verify-email/:emailVerificationToken"
              element={<VerifyemailPage />}
            />
            <Route path="/forgot-password" element={<ForgetPasswordPage />} />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />
          </Route>
        </Route>

        {/* Protected Layout + Auth Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/playlists/:playlistId"
              element={<PlaylistDetailsPage />}
            />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/problem/:id" element={<ProblemPage />} />
            <Route element={<AdminRoute />}>
              <Route path="/add-problem" element={<AddProblem />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  <>
    <RouterProvider router={router} />
  </>
);
