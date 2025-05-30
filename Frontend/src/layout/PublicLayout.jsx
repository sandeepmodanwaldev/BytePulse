// layouts/PublicLayout.jsx
import { Outlet } from "react-router-dom";
import ToggleTheme from "../pages/landing/ToogleTheam";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] text-black dark:bg-[#11111a] dark:text-white flex items-center justify-center transition-colors duration-300">
      <Outlet />
    </div>
  );
};

export default PublicLayout;
