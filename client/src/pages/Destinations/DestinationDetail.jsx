import { ArrowLeft, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import TravelMap from "@/components/maps/TravelMap";
import { api } from "@/lib/api";

function DestinationDetail() {
  const { slug } = useParams();
  const [destination, setDestination] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDestination = async () => {
      try {
        setLoading(true);
        setError("");

        const [destinationResponse, propertiesResponse] = await Promise.all([
          api.getDestinationBySlug(slug),
          api.getPropertiesByDestination(slug),
        ]);

        setDestination(destinationResponse.data || null);
        setProperties(Array.isArray(propertiesResponse.data) ? propertiesResponse.data : []);
      } catch (err) {
        console.error("Destination detail load error:", err);
        setError("Destination not found or unable to load this destination.");
        setDestination(null);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadDestination();
    }
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Loading destination...</h1>
        </div>
      </main>
    );
  }

  if (!destination || error) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Destination not found</h1>

          <p className="mt-3 text-neutral-600">
            The destination you're looking for doesn't exist.
          </p>

          <Link
            to="/destinations"
            className="mt-6 inline-flex items-center gap-2 font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to destinations
          </Link>
        </div>
      </main>
    );
  }

  const destinationLocation =
    typeof destination.location === "string"
      ? destination.location
      : destination.location?.city || destination.location?.country || "Destination";

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
                {destinationLocation}
              </div>

              <h1 className="mt-3 text-5xl font-bold sm:text-6xl">
                {destination.name}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
                {destination.description}
              </p>

              <Link
                to={`/properties?destination=${destination.slug}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
              >
                Explore stays
              </Link>
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
        </div>

        <div className="mt-10">
          <TravelMap
            latitude={destination.latitude}
            longitude={destination.longitude}
            zoom={11}
            properties={properties}
            attractions={destination.attractions || destination.attractionsData || []}
          />
        </div>
      </section>
    </main>
  );
}

export default DestinationDetail;