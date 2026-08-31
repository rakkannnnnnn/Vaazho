import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Mail, Shield, User } from "lucide-react";

function Account() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-neutral-50/50 px-4 py-16 text-neutral-900 dark:bg-neutral-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
          VAZHO Profile
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Welcome, {user?.name || "Traveler"}!
        </h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Manage your personal information and account settings.
        </p>

        {/* Profile Card */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
          <div className="flex items-center gap-4 border-b border-neutral-100 pb-6 dark:border-neutral-800">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-900 text-xl font-bold text-white dark:bg-white dark:text-neutral-950">
              {(user?.name || "U")[0].toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                <Shield className="h-3 w-3" />
                {user?.role ? user.role.toUpperCase() : "CUSTOMER"}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800/40">
              <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                <User className="h-4 w-4" />
                <span>Full Name</span>
              </div>
              <span className="font-semibold text-neutral-900 dark:text-white">
                {user?.name}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800/40">
              <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                <Mail className="h-4 w-4" />
                <span>Email Address</span>
              </div>
              <span className="font-semibold text-neutral-900 dark:text-white">
                {user?.email}
              </span>
            </div>
          </div>

          <div className="mt-8 border-t border-neutral-100 pt-6 dark:border-neutral-800">
            <Button
              variant="destructive"
              onClick={logout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Account;
