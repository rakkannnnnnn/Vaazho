import { ArrowLeft, BedDouble, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { api } from "@/lib/api";

function RoomDetails() {
  const { slug } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadRoom = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.getRoomBySlug(slug);
        setRoom(response.data || null);
      } catch (err) {
        setError("Room not found or unavailable.");
        setRoom(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadRoom();
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Loading room...</h1>
        </div>
      </main>
    );
  }

  if (!room || error) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Room not found</h1>

          <p className="mt-3 text-neutral-600 dark:text-neutral-400">
            The room you are looking for is not available.
          </p>

          <Link
            to="/rooms"
            className="mt-6 inline-flex items-center gap-2 font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to rooms
          </Link>
        </div>
      </main>
    );
  }

  const property = room.property || {};
  const destinationName = property.destination?.name || "Destination";

  return (
    <main>
      <section className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <img
          src={room.images?.[0] || property.images?.[0]}
          alt={room.name}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-12 lg:px-8">
            <div className="max-w-3xl text-white">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <MapPin className="h-4 w-4" />
                {destinationName} • {property.location}
              </div>

              <h1 className="mt-3 text-5xl font-bold sm:text-6xl">{room.name}</h1>

              <p className="mt-4 text-lg text-white/90">
                From ₹{room.pricePerNight} per night
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Room overview
            </p>

            <h2 className="mt-3 text-3xl font-bold text-neutral-900 dark:text-white">
              Stay in {property.name}
            </h2>

            <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
              {room.description}
            </p>

            {room.amenities?.length > 0 && (
              <div className="mt-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                  Amenities
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Room details
            </p>

            <div className="mt-4 space-y-3 text-neutral-700 dark:text-neutral-200">
              <p className="flex items-center gap-2">
                <BedDouble className="h-4 w-4" />
                <span className="font-semibold">Bed:</span> {room.bedType}
              </p>
              <p className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-semibold">Capacity:</span> {room.capacity} guests
              </p>
              <p>
                <span className="font-semibold">Room size:</span> {room.roomSize} sq ft
              </p>
              <p>
                <span className="font-semibold">Available rooms:</span> {room.availableRooms} / {room.totalRooms}
              </p>
              <p>
                <span className="font-semibold">Price:</span> ₹{room.pricePerNight}/night
              </p>
            </div>

            <Link
              to={property.slug ? `/properties/${property.slug}` : "/properties"}
              className="mt-6 inline-flex items-center gap-2 font-semibold text-neutral-900 dark:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to stay
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default RoomDetails;
