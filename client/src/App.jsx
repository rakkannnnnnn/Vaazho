import { Navigate, Route, Routes } from "react-router-dom"

import Navbar from "./components/layout/Navbar"

import Home from "./pages/Home"
import Rooms from "./pages/Rooms"
import Destinations from "./pages/Destinations"
import AIPlanner from "./pages/AIPlanner"
import MyBookings from "./pages/MyBookings"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"

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
          path="/ai-planner"
          element={<AIPlanner />}
        />

        <Route
          path="/bookings"
          element={<MyBookings />}
        />

        <Route
          path="/sign-in"
          element={<SignIn />}
        />

        <Route
          path="/sign-up"
          element={<SignUp />}
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </div>
  )
}

export default App