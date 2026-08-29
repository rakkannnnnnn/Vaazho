import { ArrowLeft, MapPin, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { api } from "@/lib/api";

function PropertyDetails() {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.getPropertyBySlug(slug);
        setProperty(response.data || null);
      } catch (err) {
        setError("Property not found or unavailable.");
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadProperty();
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Loading property...</h1>
        </div>
      </main>
    );
  }

  if (!property || error) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Property not found</h1>

          <p className="mt-3 text-neutral-600 dark:text-neutral-400">
            The property you're looking for isn't available.
          </p>

          <Link
            to="/properties"
            className="mt-6 inline-flex items-center gap-2 font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to stays
          </Link>
        </div>
      </main>
    );
  }

  const destinationName = property.destination?.name || "Destination";

  return (
    <main>
      <section className="relative h-[55vh] min-h-[400px] overflow-hidden">
        <img
          src={property.images?.[0] || property.image}
          alt={property.name}
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

              <h1 className="mt-3 text-5xl font-bold sm:text-6xl">
                {property.name}
              </h1>

              <div className="mt-4 flex items-center gap-2 text-white/90">
                <Star className="h-4 w-4 fill-current text-yellow-400" />
                {Number(property.rating || 0).toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Overview
            </p>

            <h2 className="mt-3 text-3xl font-bold text-neutral-900 dark:text-white">
              About this stay
            </h2>

            <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
              {property.description}
            </p>

            {property.address && (
              <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                  Address
                </p>
                <p className="mt-2 text-neutral-700 dark:text-neutral-200">
                  {property.address}
                </p>
              </div>
            )}

            {property.amenities?.length > 0 && (
              <div className="mt-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                  Amenities
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {property.amenities.map((amenity) => (
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
              Stay details
            </p>

            <div className="mt-4 space-y-3 text-neutral-700 dark:text-neutral-200">
              <p>
                <span className="font-semibold">Location:</span> {property.location}
              </p>
              <p>
                <span className="font-semibold">Destination:</span> {destinationName}
              </p>
              <p>
                <span className="font-semibold">Rating:</span> {Number(property.rating || 0).toFixed(1)} / 5
              </p>
            </div>

            <Link
              to="/properties"
              className="mt-6 inline-flex items-center gap-2 font-semibold text-neutral-900 dark:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Explore more stays
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default PropertyDetails;
