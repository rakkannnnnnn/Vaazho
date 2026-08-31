import React from "react";
import { Link } from "react-router-dom";
import { LogOut, User as UserIcon, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

function AuthActions() {
  const { user, isAuthenticated, logout } = useAuth();

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/bookings" className="hidden lg:block">
          <Button
            variant="ghost"
            className="dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            My Bookings
          </Button>
        </Link>

        <Link to="/account">
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-neutral-200 dark:border-neutral-800 dark:hover:bg-neutral-800"
          >
            <UserIcon className="h-3.5 w-3.5" />
            <span className="max-w-[120px] truncate">{user.name || "Account"}</span>
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="text-neutral-600 hover:text-rose-600 dark:text-neutral-400 dark:hover:text-rose-400"
          title="Sign Out"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden xl:inline">Logout</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link to="/login">
        <Button
          variant="outline"
          className="dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-800"
        >
          <UserRound className="h-4 w-4" />
          <span className="hidden sm:inline">Sign In</span>
        </Button>
      </Link>

      <Link to="/register" className="hidden sm:block">
        <Button className="dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200">
          Sign Up
        </Button>
      </Link>
    </div>
  );
}

export default AuthActions;