import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
// import api from "../utils/api";

const GigBids = () => {
  const { gigId } = useParams();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/bids/${gigId}`,
          { withCredentials: true }
        );
        setBids(res.data);
      } catch (err) {
        setError("Failed to load bids");
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [gigId]);

  const handleHire = async (bidId) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/bids/${bidId}/hire`,
        {},
        { withCredentials: true }
      );

      // Update UI immediately
      setBids((prev) =>
        prev.map((bid) =>
          bid._id === bidId
            ? { ...bid, status: "hired" }
            : { ...bid, status: "rejected" }
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to hire");
    }
  };

  const isGigAssigned = bids.some((bid) => bid.status === "hired");

  if (loading) return <div className="p-6">Loading bids...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Bids</h1>

        {bids.length === 0 ? (
          <p className="text-gray-400">No bids yet.</p>
        ) : (
          <div className="space-y-4">
            {bids.map((bid) => (
              <div
                key={bid._id}
                className="bg-white p-5 rounded-xl shadow"
              >
                {/* Freelancer basic info */}
                <p className="font-semibold">
                  {bid.freelancerId?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {bid.message}
                </p>
                <p className="text-sm mt-1">
                  Bid: ₹{bid.price}
                </p>

                <p className="text-xs mt-1">
                  Status:{" "}
                  <span className="font-medium">
                    {bid.status}
                  </span>
                </p>

                {/* ✅ HIRED FREELANCER DETAILS */}
                {bid.status === "hired" && (
                  <div className="mt-4 bg-green-50 border border-green-200 p-4 rounded-lg">
                    <p className="font-semibold text-green-700 mb-1">
                      ✅ Hired Freelancer
                    </p>
                    <p className="text-sm">
                      <strong>Name:</strong>{" "}
                      {bid.freelancerId?.name}
                    </p>
                    <p className="text-sm">
                      <strong>Email:</strong>{" "}
                      {bid.freelancerId?.email}
                    </p>
                  </div>
                )}

                {/* Hire button logic */}
                {bid.status === "pending" && !isGigAssigned && (
                  <button
                    onClick={() => handleHire(bid._id)}
                    className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                  >
                    Hire
                  </button>
                )}

                {bid.status === "pending" && isGigAssigned && (
                  <p className="mt-4 text-sm text-gray-400">
                    Hiring closed
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GigBids;
