import { Navigate, Route, Routes } from "react-router-dom"

import Navbar from "./components/layout/Navbar"

import Home from "./pages/Home"
import Rooms from "./pages/Rooms"
import DestinationDetail from "./pages/DestinationDetail"
import Destinations from "./pages/Destinations"
import AIPlanner from "./pages/AIPlanner"
import MyBookings from "./pages/MyBookings"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Footer from "./components/layout/Footer"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Privacy from "./pages/Privacy"
import Terms from "./pages/Terms"
import Dashboard from "./pages/Dashboard"


function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <Routes>
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
          path="/ai-planner"
          element={<AIPlanner />}
        />

        <Route
          path="/bookings"
          element={<MyBookings />}
        />
        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/privacy"
          element={<Privacy />}
        />

        <Route
          path="/terms"
          element={<Terms />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/sign-in/*"
          element={<SignIn />}
        />

        <Route
          path="/sign-up/*"
          element={<SignUp />}
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
      <Footer />
    </div>
  )
}

export default App