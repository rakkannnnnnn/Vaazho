import { Link } from "react-router-dom";
import { Show, UserButton } from "@clerk/react";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

function AuthActions() {
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

      <Show when="signed-out">
        <Link to="/sign-in">
          <Button
            variant="outline"
            className="dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-800"
          >
            <UserRound />
            <span className="hidden sm:inline">Sign In</span>
          </Button>
        </Link>

        <Link to="/sign-up" className="hidden sm:block">
          <Button className="dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200">
            Sign Up
          </Button>
        </Link>
      </Show>

      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
}

export default AuthActions;