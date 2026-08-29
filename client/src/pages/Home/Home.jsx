
import { useEffect, useState } from "react";

import Hero from "@/components/home/Hero";
import DestinationSection from "@/components/destinations/DestinationSection";
import { api } from "@/lib/api";

function Home() {
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
    <main className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-white">
      <Hero />

      <DestinationSection
        destinations={destinations}
        loading={loading}
        error={error}
      />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            Explore with VAZHO
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Travel planning, made simpler.
          </h2>

          <p className="mt-4 text-neutral-600 dark:text-neutral-400">
            Find stays, explore destinations, and build personalized
            travel experiences from one place.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Home;
