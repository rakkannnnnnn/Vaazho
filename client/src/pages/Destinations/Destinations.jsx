import DestinationGrid from "@/components/destinations/DestinationGrid";
import { destinations } from "@/data/destinations";

function Destinations() {
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

        <DestinationGrid destinations={destinations} />
      </div>
    </main>
  );
}

export default Destinations;