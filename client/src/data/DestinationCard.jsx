import { MapPin, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function DestinationCard({ destination }) {
  return (
    <Link
      to={`/destinations/${destination.id}`}
      className="group block overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
          <div>
            <div className="flex items-center gap-1 text-xs text-white/80">
              <MapPin className="h-3.5 w-3.5" />
              {destination.location}
            </div>

            <h3 className="mt-1 text-2xl font-bold">
              {destination.name}
            </h3>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black transition group-hover:scale-110">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="p-5">
        <p className="line-clamp-2 text-sm leading-6 text-neutral-600">
          {destination.description}
        </p>

        <p className="mt-4 text-sm font-semibold">
          Explore destination →
        </p>
      </div>
    </Link>
  );
}

export default DestinationCard;