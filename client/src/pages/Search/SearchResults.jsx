import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { X, Sliders } from "lucide-react";

import PropertyGrid from "@/components/properties/PropertyGrid";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Search filters state
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minRating: "",
    amenities: [],
    sort: "featured",
  });

  // Get search parameters
  const destination = searchParams.get("destination") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests") || "1";

  // Fetch properties based on search and filters
  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        setError("");

        // Build query params
        const queryParams = new URLSearchParams({
          destination,
          checkIn,
          checkOut,
          guests,
          ...(filters.minPrice && { minPrice: filters.minPrice }),
          ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
          ...(filters.minRating && { minRating: filters.minRating }),
          ...(filters.amenities.length > 0 && { amenities: filters.amenities.join(",") }),
          ...(filters.sort && { sort: filters.sort }),
        });

        const response = await api.getPropertiesBySearch(queryParams.toString());
        setProperties(response.data || []);
      } catch (err) {
        setError("Unable to load search results. Please try again.");
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    if (destination) {
      loadProperties();
    }
  }, [destination, checkIn, checkOut, guests, filters]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleAmenityToggle = (amenity) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const allAmenities = [
    "Wi-Fi",
    "AC",
    "Parking",
    "Pool",
    "Restaurant",
    "Gym",
    "Spa",
  ];

  return (
    <main className="min-h-screen bg-neutral-50 py-16 dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Search Summary */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            SEARCH RESULTS
          </p>

          <h1 className="mt-2 text-4xl font-bold text-neutral-900 dark:text-white">
            Stays in {destination}
          </h1>

          <p className="mt-3 text-neutral-600 dark:text-neutral-400">
            {checkIn && checkOut && (
              <>
                {formatDate(checkIn)} – {formatDate(checkOut)} • {guests}{" "}
                {guests === "1" ? "guest" : "guests"}
              </>
            )}
          </p>
        </div>

        {/* Mobile Filters Button */}
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <div className="text-sm font-semibold">
            {properties.length} stays found
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Sliders className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
          {/* Filters Sidebar */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900 lg:block`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Filters
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Price Filter */}
            <div className="mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-700">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Price Range
              </h4>
              <div className="mt-3 flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: e.target.value })
                  }
                  className="h-9 w-full rounded border border-neutral-200 px-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: e.target.value })
                  }
                  className="h-9 w-full rounded border border-neutral-200 px-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-700">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Rating
              </h4>
              <div className="mt-3 space-y-2">
                {["4.5", "4", "3.5", "3"].map((rating) => (
                  <label key={rating} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={filters.minRating === rating}
                      onChange={(e) =>
                        setFilters({ ...filters, minRating: e.target.value })
                      }
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">
                      {rating}+
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Amenities Filter */}
            <div className="mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-700">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Amenities
              </h4>
              <div className="mt-3 space-y-2">
                {allAmenities.map((amenity) => (
                  <label key={amenity} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="h-4 w-4"
                    />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">
                      {amenity}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="mt-6 border-t border-neutral-200 pt-4 dark:border-neutral-700">
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Sort By
              </h4>
              <select
                value={filters.sort}
                onChange={(e) =>
                  setFilters({ ...filters, sort: e.target.value })
                }
                className="mt-3 h-9 w-full rounded border border-neutral-200 px-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
              >
                <option value="featured">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {/* Results */}
          <div>
            {loading && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-900">
                <p className="text-neutral-600 dark:text-neutral-400">
                  Loading stays...
                </p>
              </div>
            )}

            {!loading && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-600 dark:border-red-900/60 dark:bg-red-900/10 dark:text-red-400">
                {error}
              </div>
            )}

            {!loading && !error && properties.length === 0 && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-900">
                <p className="text-neutral-900 dark:text-white">
                  No stays found
                </p>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                  Try changing your dates, budget, or filters.
                </p>
              </div>
            )}

            {!loading && !error && properties.length > 0 && (
              <>
                <div className="mb-6 hidden text-sm font-semibold text-neutral-900 dark:text-white lg:block">
                  {properties.length} stays found
                </div>
                <PropertyGrid properties={properties} />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default SearchResults;
