import { LogOut, Menu, User, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { navLinks } from "./navLinks";

function MobileNav({ open, onToggle, onNavigate }) {
  const { user, isAuthenticated, logout } = useAuth();
  const privateLinks = isAuthenticated
    ? [{ label: "Expenses", path: "/expenses" }]
    : [];
  const roleLinks = user?.role === "owner"
    ? [{ label: "Owner Dashboard", path: "/owner" }]
    : user?.role === "admin"
      ? [{ label: "Admin Dashboard", path: "/admin" }]
      : [];

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
      >
        {open ? <X size={21} /> : <Menu size={21} />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full border-t border-neutral-200 bg-white px-6 py-4 shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
          <nav className="flex flex-col gap-1">
            {[...navLinks, ...privateLinks, ...roleLinks].map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-neutral-100 text-neutral-950 dark:bg-neutral-800 dark:text-white"
                      : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {isAuthenticated && user ? (
            <div className="mt-3 space-y-1 border-t border-neutral-200 pt-3 dark:border-neutral-800">
              <NavLink
                to="/bookings"
                onClick={onNavigate}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                My Bookings
              </NavLink>

              <NavLink
                to="/account"
                onClick={onNavigate}
                className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                <User className="h-4 w-4" />
                <span>Account ({user.name})</span>
              </NavLink>

              <button
                type="button"
                onClick={() => {
                  onNavigate();
                  logout();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="mt-3 flex gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-800">
              <NavLink
                to="/login"
                onClick={onNavigate}
                className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-center text-sm font-semibold text-neutral-900 dark:border-neutral-800 dark:text-white"
              >
                Sign In
              </NavLink>

              <NavLink
                to="/register"
                onClick={onNavigate}
                className="flex-1 rounded-xl bg-neutral-900 py-2.5 text-center text-sm font-semibold text-white dark:bg-white dark:text-neutral-950"
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MobileNav;