import { Users } from "lucide-react";

function GuestField() {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <Users className="h-5 w-5 shrink-0 text-neutral-500 dark:text-neutral-400" />

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Guests
        </p>

        <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-200">
          2 guests
        </p>
      </div>
    </div>
  );
}

export default GuestField;