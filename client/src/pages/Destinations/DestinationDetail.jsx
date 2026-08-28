import { ArrowLeft, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { destinations } from "@/data/destinations";

function DestinationDetail() {
  const { destinationId } = useParams();

  const destination = destinations.find(
    (item) => item.id === destinationId
  );

  if (!destination) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Destination not found
          </h1>

          <p className="mt-3 text-neutral-600">
            The destination you're looking for doesn't exist.
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <section className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-12 lg:px-8">
            <div className="max-w-3xl text-white">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <MapPin className="h-4 w-4" />
                {destination.location}
              </div>

              <h1 className="mt-3 text-5xl font-bold sm:text-6xl">
                {destination.name}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
                {destination.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
            Discover
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Explore {destination.name}
          </h2>

          <p className="mt-4 leading-7 text-neutral-600">
            Destination stays, rooms, activities and other travel
            experiences will appear here as the VAZHO platform is
            connected to its backend.
          </p>
        </div>
      </section>
    </main>
  );
}

export default DestinationDetail;