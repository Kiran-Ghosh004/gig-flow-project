import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const PlaceBid = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [gig, setGig] = useState(null);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasBidAlready, setHasBidAlready] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gigRes, myBidsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/gigs/${gigId}`, {
            withCredentials: true,
          }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/bids/my`, {
            withCredentials: true,
          }),
        ]);

        setGig(gigRes.data);

        const alreadyBid = myBidsRes.data.some(
          (bid) => bid.gigId?._id === gigId
        );
        setHasBidAlready(alreadyBid);
      } catch (err) {
        setError("Failed to load gig");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gigId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bids`,
        { gigId, price, message },
        { withCredentials: true }
      );

      navigate("/gigs");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place bid");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error && !gig) return <div className="p-6 text-red-500">{error}</div>;

  // 🔒 SELF-BID CHECK (robust)
  const isOwner =
    gig.ownerId === user?._id ||
    gig.ownerId?._id === user?._id;

  // ✅ SAFE OWNER INFO
  const ownerName = gig.ownerId?.name || "Not available";
  const ownerEmail = gig.ownerId?.email || "Not available";

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-2">{gig.title}</h1>
        <p className="text-gray-500 text-sm mb-3">{gig.description}</p>

        <p className="text-sm mb-3">
          <strong>Budget:</strong> ₹{gig.budget}
        </p>

        {/* ✅ CLIENT INFO */}
        <div className="mb-4 bg-gray-50 border p-3 rounded-lg text-sm">
          <p className="font-semibold mb-1">Posted by</p>
          <p>
            <strong>Name:</strong> {ownerName}
          </p>
          <p>
            <strong>Email:</strong> {ownerEmail}
          </p>
        </div>

        {/* ❌ SELF BID */}
        {isOwner && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg text-sm">
            ⚠️ You cannot bid on your own gig.
          </div>
        )}

        {/* ❌ DUPLICATE BID */}
        {!isOwner && hasBidAlready && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg text-sm">
            ℹ️ You have already placed a bid on this gig.
          </div>
        )}

        {/* ✅ BID FORM */}
        {!isOwner && !hasBidAlready && (
          <>
            {error && (
              <p className="text-red-500 text-sm mb-3">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="number"
                placeholder="Your bid price"
                className="w-full border p-2 rounded-lg"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />

              <textarea
                placeholder="Message to client"
                className="w-full border p-2 rounded-lg"
                rows="4"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
              >
                Place Bid
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default PlaceBid;
