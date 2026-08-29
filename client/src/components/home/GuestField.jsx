import { Users } from "lucide-react";
import { useState } from "react";

function GuestField({ guests, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleIncrement = () => {
    if (guests < 8) {
      onChange(guests + 1);
    }
  };

  const handleDecrement = () => {
    if (guests > 1) {
      onChange(guests - 1);
    }
  };

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <Users className="h-5 w-5 shrink-0 text-neutral-500 dark:text-neutral-400" />

      <div className="relative min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Guests
        </p>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="mt-1 text-sm text-neutral-700 dark:text-neutral-200"
        >
          {guests} {guests === 1 ? "guest" : "guests"}
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 z-50 mt-2 rounded-lg border border-neutral-200 bg-white p-4 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={guests <= 1}
                className="h-8 w-8 rounded border border-neutral-200 disabled:opacity-50 dark:border-neutral-600"
              >
                −
              </button>
              <span className="w-4 text-center text-sm font-semibold">
                {guests}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={guests >= 8}
                className="h-8 w-8 rounded border border-neutral-200 disabled:opacity-50 dark:border-neutral-600"
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GuestField;