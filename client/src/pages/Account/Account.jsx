import { useUser } from "@clerk/react";

function Account() {
  const { user } = useUser();

  return (
    <main className="min-h-screen bg-white px-6 py-20 text-neutral-900 dark:bg-neutral-950 dark:text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
          VAZHO account
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Welcome, {user?.firstName || "Traveler"}!
        </h1>
        <p className="mt-4 text-neutral-600 dark:text-neutral-400">
          This is your VAZHO account area.
        </p>
      </div>
    </main>
  );
}

export default Account;
