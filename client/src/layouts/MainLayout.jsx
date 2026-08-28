import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/layout/Footer";

function MainLayout() {
  return (
    <div className="min-h-screen bg-white text-neutral-950 transition-colors duration-200 dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;