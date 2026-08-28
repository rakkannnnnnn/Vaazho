import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";

import DestinationField from "./DestinationField";
import DateField from "./DateField";
import GuestField from "./GuestField";

function SearchCard() {
  const handleSearch = (event) => {
    event.preventDefault();

    console.log("VAZHO search submitted");
  };

  return (
    <form
      onSubmit={handleSearch}
      className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-2xl backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900"
    >
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="flex-1 rounded-xl px-4 py-3 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <DestinationField />
        </div>

        <div className="hidden h-10 w-px bg-neutral-200 dark:bg-neutral-700 lg:block" />

        <div className="flex-1 rounded-xl px-4 py-3 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <DateField />
        </div>

        <div className="hidden h-10 w-px bg-neutral-200 dark:bg-neutral-700 lg:block" />

        <div className="flex-1 rounded-xl px-4 py-3 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <GuestField />
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-14 rounded-xl px-7"
        >
          <Search />
          <span>Search</span>
        </Button>
      </div>
    </form>
  );
}

export default SearchCard;