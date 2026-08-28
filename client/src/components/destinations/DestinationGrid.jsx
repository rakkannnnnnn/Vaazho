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
      {destinations.map((destination) => (
        <div
          key={destination.id || destination.slug || destination.name}
          className="overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
        >
          {destination.image && (
            <img
              src={destination.image}
              alt={destination.name}
              className="h-56 w-full object-cover"
            />
          )}

          <div className="p-5">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">
              {destination.name}
            </h3>

            {destination.description && (
              <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                {destination.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DestinationGrid;