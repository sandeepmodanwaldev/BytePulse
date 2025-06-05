import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Code, LogOut, User } from "lucide-react";
import LogoutPage from "../pages/Auth/LogoutPage";
import ToggleTheme from "../pages/landing/ToogleTheam";

function Navbar() {
  const { authUser, profile } = useAuthStore();

  return (
    <>
      {/* <div className="border-4 border-red-500 dark:border-green-500 p-10 rounded-2xl"></div> */}
      <nav className="sticky top-0 z-50 w-full py-5 ">
        <div className="flex w-full justify-between dark:bg-gray-800/40 bg-gray-900/90 backdrop-blur-sm mx-auto max-w-[90%] shadow-lg shadow-neutral-600/5 border border-gray-200 dark:border-gray-700 p-4 rounded-2xl">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center gap-2 cursor-pointer  h-11 w-40 select-none"
          >
            <img src="/bytw.png" className="h-20 w-40" alt="Logo" />
          </Link>
          <div className="flex items-center gap-4">
            <ToggleTheme />
            {/* User Profile and Dropdown */}
            {authUser ? (
              <div className="flex items-center gap-8">
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-ghost btn-circle avatar flex flex-row"
                  >
                    <div className="w-10 rounded-full hover:scale-140 border-2 border-gray-300">
                      <img
                        src={
                          profile?.avatar ||
                          "https://avatar.iran.liara.run/public/boy"
                        }
                        alt="User Avatar"
                        className="object-cover"
                      />
                    </div>
                  </label>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 text-gray-50 dark:bg-gray-800  dark:text-gray-100 rounded-box w-52 space-y-3"
                  >
                    <li>
                      <p className="text-base font-semibold ml-6 overflow-auto select-none hover:none font-playpen">
                        {authUser?.name}
                      </p>
                      <hr className="border-gray-200 dark:border-gray-600" />
                    </li>
                    <li>
                      <Link
                        to="/profile"
                        className="hover:bg-primary font-inter hover:text-white text-base font-semibold dark:hover:bg-blue-600"
                      >
                        <User className="w-4 h-4 mr-2 " />
                        My Profile
                      </Link>
                    </li>
                    {authUser?.role === "ADMIN" && (
                      <li>
                        <Link
                          to="/add-problem"
                          className="hover:bg-primary font-inter hover:text-white text-base font-semibold dark:hover:bg-blue-600"
                        >
                          <Code className="w-4 h-4 mr-1" />
                          Add Problem
                        </Link>
                      </li>
                    )}
                    <li>
                      <LogoutPage />
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <button className="bg-blue-500 font-inter dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-xl">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
