import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

function DestinationField() {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <MapPin className="h-5 w-5 shrink-0 text-neutral-500 dark:text-neutral-400" />

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Destination
        </p>

        <Input
          type="text"
          placeholder="Where are you going?"
          className="mt-1 h-8 border-0 bg-transparent px-0 text-sm text-neutral-900 shadow-none placeholder:text-neutral-500 focus-visible:ring-0 dark:text-white dark:placeholder:text-neutral-400"
        />
      </div>
    </div>
  );
}

export default DestinationField;