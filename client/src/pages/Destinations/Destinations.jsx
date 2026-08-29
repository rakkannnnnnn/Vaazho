import { useEffect, useState } from "react";

import DestinationGrid from "@/components/destinations/DestinationGrid";
import { api } from "@/lib/api";

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.getDestinations();
        setDestinations(response.data || []);
      } catch (err) {
        setError("Unable to load destinations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadDestinations();
  }, []);

  return (
    <main className="min-h-screen bg-neutral-50 py-16 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            VAZHO
          </p>

          <h1 className="mt-2 text-4xl font-bold text-neutral-900 dark:text-white">
            Explore destinations
          </h1>

          <p className="mt-3 max-w-2xl text-neutral-600 dark:text-neutral-400">
            Discover destinations and find inspiration for your next trip.
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-neutral-600 dark:text-neutral-400">
              Loading destinations...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600 dark:border-red-900/60 dark:bg-red-900/10 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && <DestinationGrid destinations={destinations} />}
      </div>
    </main>
  );
}

export default Destinations;