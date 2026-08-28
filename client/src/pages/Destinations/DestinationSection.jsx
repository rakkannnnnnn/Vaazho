import { Link } from "react-router-dom";

import DestinationGrid from "./DestinationGrid";

function DestinationSection({ destinations = [] }) {
  return (
    <section className="bg-white py-16 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Explore
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
              Discover destinations
            </h2>

            <p className="mt-3 max-w-2xl text-neutral-600 dark:text-neutral-400">
              Find places worth exploring and start planning your next journey.
            </p>
          </div>

          <Link
            to="/destinations"
            className="hidden text-sm font-semibold text-neutral-900 hover:underline dark:text-white sm:block"
          >
            View all
          </Link>
        </div>

        <DestinationGrid destinations={destinations} />
      </div>
    </section>
  );
}

export default DestinationSection;