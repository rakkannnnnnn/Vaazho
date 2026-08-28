import { CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";

function DateField() {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <CalendarDays className="h-5 w-5 shrink-0 text-neutral-500 dark:text-neutral-400" />

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Dates
        </p>

        <Input
          type="date"
          className="mt-1 h-8 border-0 bg-transparent px-0 text-sm text-neutral-900 shadow-none focus-visible:ring-0 dark:[color-scheme:dark] dark:text-white"
        />
      </div>
    </div>
  );
}

export default DateField;