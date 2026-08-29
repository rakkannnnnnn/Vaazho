import PropertyCard from "./PropertyCard";

function PropertyGrid({ properties = [] }) {
  if (properties.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-neutral-600 dark:text-neutral-400">
          No stays available for this destination yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property._id || property.slug} property={property} />
      ))}
    </div>
  );
}

export default PropertyGrid;
