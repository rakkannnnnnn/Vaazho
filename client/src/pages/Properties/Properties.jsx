import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import PropertyGrid from "@/components/properties/PropertyGrid";
import { api } from "@/lib/api";

function Properties() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const destinationSlug = useMemo(
    () => searchParams.get("destination") || "",
    [searchParams]
  );

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        setError("");

        const response = destinationSlug
          ? await api.getPropertiesByDestination(destinationSlug)
          : await api.getProperties();

        setProperties(response.data || []);
      } catch (err) {
        setError("Unable to load properties. Please try again.");
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [destinationSlug]);

  return (
    <main className="min-h-screen bg-neutral-50 py-16 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            VAZHO STAYS
          </p>

          <h1 className="mt-2 text-4xl font-bold text-neutral-900 dark:text-white">
            {destinationSlug ? `Stays in ${destinationSlug}` : "Explore stays"}
          </h1>

          <p className="mt-3 max-w-2xl text-neutral-600 dark:text-neutral-400">
            Discover curated accommodations and memorable stays for your next journey.
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-neutral-600 dark:text-neutral-400">
              Loading properties...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600 dark:border-red-900/60 dark:bg-red-900/10 dark:text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && <PropertyGrid properties={properties} />}
      </div>
    </main>
  );
}

export default Properties;
