import { ArrowRight, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

function PropertyCard({ property }) {
  if (!property) {
    return null;
  }

  const destinationName =
    property.destination?.name ||
    property.location ||
    "Destination";

  return (
    <Link
      to={`/properties/${property.slug}`}
      className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images?.[0] || property.image}
          alt={property.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-neutral-900">
          <Star className="h-3.5 w-3.5 fill-current" />
          {Number(property.rating || 0).toFixed(1)}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
          <MapPin className="h-4 w-4" />
          {destinationName}
        </div>

        <h3 className="mt-3 text-xl font-semibold text-neutral-900 dark:text-white">
          {property.name}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          {property.description}
        </p>

        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
          View details
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export default PropertyCard;
