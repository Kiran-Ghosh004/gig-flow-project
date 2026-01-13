import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ❌ Hide navbar on auth pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
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
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate("/dashboard")}>
        GigFlow
      </h1>

      {user && (
  <div className="flex items-center gap-4">
    {/* ➕ Create Gig Button */}
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

    </nav>
  );
};

export default Navbar;
