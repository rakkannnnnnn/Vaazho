import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import DestinationField from "./DestinationField";
import DateField from "./DateField";
import GuestField from "./GuestField";

function SearchCard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const handleSearch = (event) => {
    event.preventDefault();

    // Validation
    if (!searchParams.destination) {
      toast.error("Please select a destination");
      return;
    }

    if (!searchParams.checkIn) {
      toast.error("Please select a check-in date");
      return;
    }

    if (!searchParams.checkOut) {
      toast.error("Please select a check-out date");
      return;
    }

    if (new Date(searchParams.checkOut) <= new Date(searchParams.checkIn)) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    if (searchParams.guests <= 0) {
      toast.error("Please select at least 1 guest");
      return;
    }

    // Build query string
    const params = new URLSearchParams({
      destination: searchParams.destination,
      checkIn: searchParams.checkIn,
      checkOut: searchParams.checkOut,
      guests: searchParams.guests,
    });

    navigate(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-2xl backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900"
    >
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="flex-1 rounded-xl px-4 py-3 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <DestinationField
            value={searchParams.destination}
            onChange={(value) =>
              setSearchParams({ ...searchParams, destination: value })
            }
          />
        </div>

        <div className="hidden h-10 w-px bg-neutral-200 dark:bg-neutral-700 lg:block" />

        <div className="flex-1 rounded-xl px-4 py-3 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <DateField
            checkIn={searchParams.checkIn}
            checkOut={searchParams.checkOut}
            onCheckInChange={(value) =>
              setSearchParams({ ...searchParams, checkIn: value })
            }
            onCheckOutChange={(value) =>
              setSearchParams({ ...searchParams, checkOut: value })
            }
          />
        </div>

        <div className="hidden h-10 w-px bg-neutral-200 dark:bg-neutral-700 lg:block" />

        <div className="flex-1 rounded-xl px-4 py-3 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <GuestField
            guests={searchParams.guests}
            onChange={(value) =>
              setSearchParams({ ...searchParams, guests: value })
            }
          />
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