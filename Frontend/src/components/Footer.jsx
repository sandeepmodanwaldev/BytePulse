import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900/90 dark:bg-gray-800/40 backdrop-blur-sm text-white dark:text-gray-100 border-t border-gray-700 shadow-inner bottom">
      <div className="max-w-[90%] mx-auto py-6 px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left Side - Logo or Site Name */}
        {/* <Link to="/" className="flex items-center gap-2">
          <img
            src="/bytw.png"
            alt="Logo"
            className="h-10 w-24 object-contain"
          />
          <span className="text-lg font-semibold">YourSite</span>
        </Link> */}

        {/* Center - Navigation Links */}
        <div className="flex gap-6 text-sm">
          <Link to="/" className="hover:text-blue-400 transition">
            Home
          </Link>
          <Link to="/about" className="hover:text-blue-400 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-blue-400 transition">
            Contact
          </Link>
          <Link to="/privacy" className="hover:text-blue-400 transition">
            Privacy
          </Link>
        </div>

        {/* Right Side - Copyright */}
        <p className="text-xs text-gray-400 text-center md:text-right">
          &copy; {new Date().getFullYear()} BytePulse. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
