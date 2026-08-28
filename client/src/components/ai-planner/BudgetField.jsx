import { IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";

function BudgetField({ value, onChange }) {
  return (
    <div>
      <label
        htmlFor="budget"
        className="mb-2 block text-sm font-semibold"
      >
        Trip budget
      </label>

      <div className="relative">
        <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />

        <Input
          id="budget"
          type="number"
          min="0"
          placeholder="25,000"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="pl-9"
        />
      </div>

      <p className="mt-1.5 text-xs text-neutral-500">
        Enter your approximate total trip budget.
      </p>
    </div>
  );
}

export default BudgetField;