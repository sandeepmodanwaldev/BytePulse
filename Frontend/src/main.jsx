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

import ProtectedRoute from "./components/protectedRoute/ProtectedRoute.jsx";
import AdminRoute from "./components/protectedRoute/AdminRoute.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import SignUpPage from "./pages/Auth/SignUpPage.jsx";
import ProblemPage from "./pages/ProblemPage.jsx";
import AddProblem from "./pages/AddProblem.jsx";
import HomePage from "./pages/HomePage.jsx";
import { Toaster } from "sonner";
import LogoutPage from "./pages/Auth/logoutPage.jsx";
import VerifyemailPage from "./pages/Auth/VerifyemailPage.jsx";
import ForgetPasswordPage from "./pages/Auth/ForgetPasswordPage.jsx";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/logout" element={<LogoutPage />} />
      <Route
        path="/verify-email/:emailVerificationToken"
        element={<VerifyemailPage />}
      />
      <Route path="/forgot-password" element={<ForgetPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/" element={<App />}>
        <Route path="/" element={<HomePage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<ProblemPage />} />
          <Route path="/problem/:id" element={<ProblemPage />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path="/add-problem" element={<AddProblem />} />
        </Route>
      </Route>
    </>
  )
);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <>
    <Toaster />
    <RouterProvider router={router} />
  </>
  // </StrictMode>
);
