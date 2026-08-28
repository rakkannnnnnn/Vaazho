import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { navLinks } from "./navLinks";

function MobileNav({ open, onToggle, onNavigate }) {
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
            {navLinks.map((link) => (
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

          <div className="mt-3 border-t pt-3">
            <NavLink
              to="/bookings"
              onClick={onNavigate}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              My Bookings
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileNav;