import useThemeStore from "../../store/useThemeStore";

const ToggleTheme = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="flex justify-end items-center p-4 bg-gray-100 dark:bg-gray-800">
      <button
        onClick={toggleTheme}
        className={`relative w-14 h-8 flex items-center rounded-full transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-600" : "bg-gray-300"
        }`}
        aria-label="Toggle Theme"
      >
        <div
          className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
            theme === "dark" ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleTheme;
