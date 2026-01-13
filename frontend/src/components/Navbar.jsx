import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // ❌ Hide navbar on auth pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed");
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          GigFlow
        </h1>

        {/* Desktop Menu */}
        {user && (
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate("/gigs")}
              className="border px-4 py-1.5 rounded-lg hover:bg-gray-100 text-sm"
            >
              Browse Gigs
            </button>

            <button
              onClick={() => navigate("/create-gig")}
              className="border px-4 py-1.5 rounded-lg hover:bg-gray-100 text-sm"
            >
              + Create Gig
            </button>

            <span className="text-gray-600 text-sm">
              {user.name}
            </span>

            <button
              onClick={handleLogout}
              className="bg-black text-white px-4 py-1.5 rounded-lg hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        )}

        {/* Mobile Hamburger */}
        {user && (
          <button
            className="md:hidden text-2xl"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
        )}
      </nav>

      {/* SIDE DRAWER (NO OVERLAY) */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full gap-2.5">
          {/* Close button */}
          <button
            className="self-end text-2xl mb-6"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>

          {/* Menu items */}
          <button
            onClick={() => {
              navigate("/gigs");
              setMenuOpen(false);
            }}
            className="text-left px-3 py-2 rounded hover:bg-gray-100"
          >
            Browse Gigs
          </button>

          <button
            onClick={() => {
              navigate("/create-gig");
              setMenuOpen(false);
            }}
            className="text-left px-3 py-2 rounded hover:bg-gray-100 border"
          >
            + Create Gig
          </button>

          <div className="mt-4 px-3 text-sm text-gray-600">
            Logged in as 
            <span className="text-gray-800 font-medium">      {user?.name}</span>
          </div>

          {/* Logout at bottom */}
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
