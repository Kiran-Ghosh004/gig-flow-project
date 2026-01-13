import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const Gigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/gigs`,
          { withCredentials: true }
        );
        setGigs(res.data);
      } catch (error) {
        console.error("Failed to fetch gigs");
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  if (loading) {
    return <div className="p-6">Loading gigs...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Available Gigs</h1>

        {gigs.length === 0 ? (
          <p className="text-gray-400">No gigs available.</p>
        ) : (
          <div className="space-y-4">
            {gigs.map((gig) => (
              <div
                key={gig._id}
                className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold">{gig.title}</h2>
                  <p className="text-gray-500 text-sm">{gig.description}</p>
                  <p className="text-sm mt-1">
                    Budget: ₹{gig.budget}
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/gigs/${gig._id}`)}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                  Place Bid
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gigs;
