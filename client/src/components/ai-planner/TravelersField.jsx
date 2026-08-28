import { Users } from "lucide-react";
import { Input } from "@/components/ui/input";

function TravelersField({ value, onChange }) {
  return (
    <div>
      <label
        htmlFor="travelers"
        className="mb-2 block text-sm font-semibold"
      >
        Travelers
      </label>

      <div className="relative">
        <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />

        <Input
          id="travelers"
          type="number"
          min="1"
          max="20"
          placeholder="2"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="pl-9"
        />
      </div>

      <p className="mt-1.5 text-xs text-neutral-500">
        How many people are traveling?
      </p>
    </div>
  );
}

export default TravelersField;