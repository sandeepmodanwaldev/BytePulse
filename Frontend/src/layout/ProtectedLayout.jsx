// layouts/ProtectedLayout.jsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import ToggleTheme from "../pages/landing/ToogleTheam";

const ProtectedLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-black dark:bg-[#11111a] dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="p-4 flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;
