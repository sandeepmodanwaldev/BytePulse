// App.jsx
import { Toaster } from "sonner";
import { Outlet } from "react-router-dom";
import useThemeStore from "./store/useThemeStore";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";

const App = () => {
  const applyTheme = useThemeStore((state) => state.applyTheme);
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  );
};

export default App;
