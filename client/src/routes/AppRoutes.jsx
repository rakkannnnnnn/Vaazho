import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";

import Home from "@/pages/Home/Home";
import Rooms from "@/pages/Rooms/Rooms";
import Destinations from "@/pages/Destinations/Destinations";
import AIPlanner from "@/pages/AIPlanner/AIPlanner";
import MyBookings from "@/pages/MyBookings/MyBookings";
import DestinationDetail from "@/pages/Destinations/DestinationDetail";
import About from "@/pages/About/About";
import Contact from "@/pages/Contact/Contact";
import Terms from "@/pages/Terms/Terms";
import Privacy from "@/pages/Privacy/Privacy";
import SignInPage from "@/pages/SignIn/SignIn";
import SignUpPage from "@/pages/SignUp/SignUp";
import Account from "@/pages/Account/Account";
import Properties from "@/pages/Properties/Properties";
import PropertyDetails from "@/pages/PropertyDetails/PropertyDetails";
import { useAuth } from "@clerk/react";

function ProtectedAccount() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace state={{ from: "/account" }} />;
  }

  return <Account />;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route
            path="/destinations"
            element={<Destinations />}
          />
          <Route
            path="/destinations/:slug"
            element={<DestinationDetail />}
          />
          <Route
            path="/properties"
            element={<Properties />}
          />
          <Route
            path="/properties/:slug"
            element={<PropertyDetails />}
          />
          <Route
            path="/ai-planner"
            element={<AIPlanner />}
          />
          <Route
            path="/bookings"
            element={<MyBookings />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="/account" element={<ProtectedAccount />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;