import { CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";

function DateField({ checkIn, checkOut, onCheckInChange, onCheckOutChange }) {
  const today = new Date().toISOString().split("T")[0];

  const formatDateRange = () => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const end = new Date(checkOut).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return `${start} – ${end}`;
    }
    return "Select dates";
  };

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <CalendarDays className="h-5 w-5 shrink-0 text-neutral-500 dark:text-neutral-400" />

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Dates
        </p>

        <p className="mt-1 text-sm text-neutral-900 dark:text-white">
          {formatDateRange()}
        </p>

        {/* Hidden date inputs for form submission */}
        <Input
          type="date"
          value={checkIn}
          onChange={(e) => onCheckInChange(e.target.value)}
          min={today}
          className="hidden"
          aria-hidden="true"
        />
        <Input
          type="date"
          value={checkOut}
          onChange={(e) => onCheckOutChange(e.target.value)}
          min={checkIn || today}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      {/* Visual date picker popup (optional, can add later) */}
      <div className="hidden gap-2 lg:flex">
        <input
          type="date"
          value={checkIn}
          onChange={(e) => onCheckInChange(e.target.value)}
          min={today}
          className="h-8 rounded border border-neutral-200 px-2 text-sm dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
          title="Check-in date"
        />
        <input
          type="date"
          value={checkOut}
          onChange={(e) => onCheckOutChange(e.target.value)}
          min={checkIn || today}
          className="h-8 rounded border border-neutral-200 px-2 text-sm dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
          title="Check-out date"
        />
      </div>
    </div>
  );
}

export default DateField;