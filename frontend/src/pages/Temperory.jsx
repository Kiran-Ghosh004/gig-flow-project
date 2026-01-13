import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StatusBadge from "../components/StatusBadge";
// import api from "../utils/api";


const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myGigs, setMyGigs] = useState([]);
  const [myBids, setMyBids] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [gigsRes, bidsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/gigs/my`, {
            withCredentials: true,
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/bids/my`, {
            withCredentials: true,
          }),
        ]);

        setMyGigs(gigsRes.data);
        setMyBids(bidsRes.data);
      } catch (error) {
        console.error("Dashboard fetch failed");
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user?.name}
          </h1>
          <p className="text-gray-500 text-sm">
            {user?.email}
          </p>
        </div>

        {/* Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Client Section */}
          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-lg font-semibold mb-4">
              My Gigs (Client)
            </h2>

            {myGigs.length === 0 ? (
              <p className="text-gray-400 text-sm">
                Gigs you have posted will appear here.
              </p>
            ) : (
              <ul className="space-y-3">
                {myGigs.map((gig) => (
                  <li
                    key={gig._id}
                    className="border p-4 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                      navigate(`/gigs/${gig._id}/bids`)
                    }
                  >
                    <span className="font-medium">
                      {gig.title}
                    </span>
                    <span className="text-sm text-gray-500">
                      {gig.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Freelancer Section */}
          <div className="bg-white rounded-xl p-6 shadow">
            <h2 className="text-lg font-semibold mb-4">
              My Bids (Freelancer)
            </h2>

            {myBids.length === 0 ? (
              <p className="text-gray-400 text-sm">
                Bids you have placed will appear here.
              </p>
            ) : (
              <ul className="space-y-3">
                {myBids.map((bid) => (
                  <li
                    key={bid._id}
                    className="border p-4 rounded-lg"
                  >
                    <p className="font-medium">
                      {bid.gigId?.title}
                    </p>
                   <p className="text-sm mt-1">
  <StatusBadge status={bid.status} />
</p>

                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
