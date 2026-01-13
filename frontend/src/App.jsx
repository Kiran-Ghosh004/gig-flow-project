import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/DashBoard";
import Gigs from "./pages/Gigs";
import PlaceBid from "./pages/PlaceBid";
import GigBids from "./pages/GigBids";
import CreateGig from "./pages/CreateGig";

import Navbar from "./components/Navbar";
import NotificationToast from "./components/NotificationToast";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>
      <NotificationToast />
      <Navbar />

      <Routes>
  {/* Public (blocked if logged in) */}
  <Route
    path="/login"
    element={
      <PublicRoute>
        <Login />
      </PublicRoute>
    }
  />

  <Route
    path="/register"
    element={
      <PublicRoute>
        <Register />
      </PublicRoute>
    }
  />

  {/* Protected */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/gigs"
    element={
      <ProtectedRoute>
        <Gigs />
      </ProtectedRoute>
    }
  />

  <Route
    path="/gigs/:gigId"
    element={
      <ProtectedRoute>
        <PlaceBid />
      </ProtectedRoute>
    }
  />

  <Route
    path="/gigs/:gigId/bids"
    element={
      <ProtectedRoute>
        <GigBids />
      </ProtectedRoute>
    }
  />

  <Route
    path="/create-gig"
    element={
      <ProtectedRoute>
        <CreateGig />
      </ProtectedRoute>
    }
  />
</Routes>

    </BrowserRouter>
  );
}

export default App;
