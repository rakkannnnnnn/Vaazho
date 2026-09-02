import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { navLinks } from "./navLinks";

function DesktopNav() {
  const { user, isAuthenticated } = useAuth();
  const privateLinks = isAuthenticated
    ? [{ label: "Expenses", path: "/expenses" }]
    : [];
  const roleLinks = user?.role === "owner"
    ? [{ label: "Owner Dashboard", path: "/owner" }]
    : user?.role === "admin"
      ? [{ label: "Admin Dashboard", path: "/admin" }]
      : [];

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {[...navLinks, ...privateLinks, ...roleLinks].map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default DesktopNav;