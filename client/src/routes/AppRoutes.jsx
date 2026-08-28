import { BrowserRouter, Route, Routes } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";

import Home from "@/pages/Home/Home";
import Rooms from "@/pages/Rooms/Rooms";
import Destinations from "@/pages/Destinations/Destinations";
import AIPlanner from "@/pages/AIPlanner/AIPlanner";
import MyBookings from "@/pages/MyBookings/MyBookings";
import DestinationDetail from "@/pages/Destinations/DestinationDetail";

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
            path="/destinations/:destinationId"
            element={<DestinationDetail />}
          />
          <Route
            path="/ai-planner"
            element={<AIPlanner />}
          />
          <Route
            path="/bookings"
            element={<MyBookings />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;