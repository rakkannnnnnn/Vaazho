import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

function DestinationField({ value, onChange }) {
  const [destinations, setDestinations] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        setLoading(true);
        const response = await api.getDestinations();
        setDestinations(response.data || []);
      } catch (err) {
        console.error("Failed to load destinations:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && destinations.length === 0) {
      loadDestinations();
    }
  }, [isOpen, destinations.length]);

  const selectedDestination = destinations.find((d) => d.slug === value);

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <MapPin className="h-5 w-5 shrink-0 text-neutral-500 dark:text-neutral-400" />

      <div className="relative min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Destination
        </p>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="mt-1 h-8 w-full text-left text-sm text-neutral-900 dark:text-white focus:outline-none"
        >
          {selectedDestination
            ? selectedDestination.name
            : "Where are you going?"}
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-48 overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
            {loading ? (
              <div className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400">
                Loading...
              </div>
            ) : destinations.length === 0 ? (
              <div className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400">
                No destinations found
              </div>
            ) : (
              destinations.map((destination) => (
                <button
                  key={destination._id}
                  type="button"
                  onClick={() => {
                    onChange(destination.slug);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  {destination.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DestinationField;