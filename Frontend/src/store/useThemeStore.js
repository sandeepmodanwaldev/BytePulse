// stouseThemeStorere/useThemeStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Utility to apply the theme to <html>
const applyHtmlThemeClass = (theme) => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

const useThemeStore = create(
  persist(
    (set, get) => {
      const defaultTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      return {
        theme: defaultTheme,

        toggleTheme: () => {
          const currentTheme = get().theme;
          const nextTheme = currentTheme === "dark" ? "light" : "dark";

          applyHtmlThemeClass(nextTheme);
          set({ theme: nextTheme });
        },

        applyTheme: () => {
          const savedTheme = get().theme;
          applyHtmlThemeClass(savedTheme);
        },
      };
    },
    {
      name: "theme-storage", // Key used in localStorage
      partialize: (state) => ({ theme: state.theme }), // Save only theme
    }
  )
);

export default useThemeStore;
