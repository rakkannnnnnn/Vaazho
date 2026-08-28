import { CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";

function DurationField({ value, onChange }) {
  return (
    <div>
      <label
        htmlFor="duration"
        className="mb-2 block text-sm font-semibold"
      >
        Trip duration
      </label>

      <div className="relative">
        <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />

        <Input
          id="duration"
          type="number"
          min="1"
          max="30"
          placeholder="5"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="pl-9"
        />
      </div>

      <p className="mt-1.5 text-xs text-neutral-500">
        Number of days you want to travel.
      </p>
    </div>
  );
}

export default DurationField;