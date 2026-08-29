import { Link } from "react-router-dom";

function DestinationGrid({ destinations = [] }) {
  if (destinations.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-neutral-600 dark:text-neutral-400">
          No destinations available.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {destinations.map((destination) => {
        const destinationLocation =
          typeof destination.location === "string"
            ? destination.location
            : destination.location?.city || destination.location?.country || "Destination";

        return (
          <Link
            key={destination.id || destination.slug || destination.name}
            to={`/destinations/${destination.slug || destination.id}`}
            className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
          >
            {destination.image && (
              <img
                src={destination.image}
                alt={destination.name}
                className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
              />
            )}

            <div className="p-5">
              <div className="mb-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                {destinationLocation}
              </div>

              <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
                {destination.name}
              </h3>

              {destination.description && (
                <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                  {destination.description}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default DestinationGrid;