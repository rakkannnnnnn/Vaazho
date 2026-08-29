import { ArrowRight, BedDouble, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

function RoomCard({ room }) {
  if (!room) {
    return null;
  }

  const propertyName = room.property?.name || "Property";
  const destinationName = room.property?.destination?.name || "Destination";

  return (
    <Link
      to={`/rooms/${room.slug}`}
      className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={room.images?.[0] || room.image}
          alt={room.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        <div className="absolute right-4 top-4 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-neutral-900">
          ₹{room.pricePerNight}/night
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
          <MapPin className="h-4 w-4" />
          {destinationName}
        </div>

        <h3 className="mt-3 text-xl font-semibold text-neutral-900 dark:text-white">
          {room.name}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <BedDouble className="h-4 w-4" />
          {room.bedType} • {room.capacity} guests
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
          {room.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm font-semibold text-neutral-900 dark:text-white">
            <Star className="h-4 w-4 fill-current text-yellow-400" />
            {room.availableRooms || 0} available
          </div>

          <div className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
            View room
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default RoomCard;
