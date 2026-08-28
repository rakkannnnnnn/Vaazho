import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { destinations } from "@/data/destinations";

import DestinationGrid from "./DestinationGrid";

function DestinationSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Explore
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Find your next destination
          </h2>

          <p className="mt-3 text-neutral-600">
            Discover some of the places you can explore with VAZHO.
          </p>
        </div>

        <Link
          to="/destinations"
          className="inline-flex items-center gap-2 text-sm font-semibold"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <DestinationGrid destinations={destinations} />
    </section>
  );
}

export default DestinationSection;