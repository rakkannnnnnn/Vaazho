import React from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import MainLayout from "@/layouts/MainLayout";

import Home from "@/pages/Home/Home";
import Rooms from "@/pages/Rooms/Rooms";
import Destinations from "@/pages/Destinations/Destinations";
import MyBookings from "@/pages/MyBookings/MyBookings";
import Bookings from "@/pages/Bookings/Bookings";
import BookingDetails from "@/pages/BookingDetails/BookingDetails";
import DestinationDetail from "@/pages/Destinations/DestinationDetail";
import SearchResults from "@/pages/Search/SearchResults";
import About from "@/pages/About/About";
import Contact from "@/pages/Contact/Contact";
import Terms from "@/pages/Terms/Terms";
import Privacy from "@/pages/Privacy/Privacy";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import Account from "@/pages/Account/Account";
import Properties from "@/pages/Properties/Properties";
import PropertyDetails from "@/pages/PropertyDetails/PropertyDetails";
import RoomDetails from "@/pages/RoomDetails/RoomDetails";
import AITest from "@/components/ai/AITest";
import AIPlanner from "@/components/ai/AIPlanner";
import MyPlans from "@/pages/MyPlans/MyPlans";
import PlanDetails from "@/pages/MyPlans/PlanDetails";
import Expenses from "@/pages/Expenses/Expenses";
import OwnerDashboard from "@/pages/Owner/OwnerDashboard";
import AdminDashboard from "@/pages/Admin/AdminDashboard";

function ProtectedRoute({ children }) {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent dark:border-white dark:border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

function OwnerRoute({ children }) {
  const { loading, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent dark:border-white dark:border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user?.role !== "owner") {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
}

function AdminRoute({ children }) {
  const { loading, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent dark:border-white dark:border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  return children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:slug" element={<RoomDetails />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route
            path="/destinations/:slug"
            element={<DestinationDetail />}
          />
          <Route path="/properties" element={<Properties />} />
          <Route
            path="/properties/:slug"
            element={<PropertyDetails />}
          />
          <Route path="/ai-planner" element={<AIPlanner />} />
          <Route path="/ai-test" element={<AITest />} />
          <Route
            path="/my-plans"
            element={
              <ProtectedRoute>
                <MyPlans />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-plans/:planId"
            element={
              <ProtectedRoute>
                <PlanDetails />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings/:bookingId"
            element={
              <ProtectedRoute>
                <BookingDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/owner"
            element={
              <OwnerRoute>
                <OwnerDashboard />
              </OwnerRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          {/* Static Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sign-in" element={<Navigate to="/login" replace />} />
          <Route path="/sign-up" element={<Navigate to="/register" replace />} />
          <Route path="/sign-in/*" element={<Navigate to="/login" replace />} />
          <Route path="/sign-up/*" element={<Navigate to="/register" replace />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;