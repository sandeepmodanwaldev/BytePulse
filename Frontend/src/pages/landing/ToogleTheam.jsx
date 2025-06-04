import { Moon, Sun } from "lucide-react";
import useThemeStore from "../../store/useThemeStore";

const ToggleTheme = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <label className="swap swap-rotate cursor-pointer border border-gray-700 w-11 rounded-md p-2">
      {/* Hidden Checkbox */}
      <input
        type="checkbox"
        checked={theme === "dark"}
        onChange={toggleTheme}
        className="hidden"
        aria-label="Toggle Theme"
      />

      {/* Sun Icon */}
      <span className="swap-on text-2xl">
        <Sun />
      </span>

      {/* Moon Icon */}
      <span className="swap-off text-2xl">
        <Moon className="text-white" />
      </span>
    </label>
  );
};

export default ToggleTheme;
