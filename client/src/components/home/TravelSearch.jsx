import { CalendarDays, MapPin, Search, Users } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { Button } from "../ui/button"
import { Input } from "../ui/input"

function TravelSearch() {
  const navigate = useNavigate()

  const [destination, setDestination] = useState("")
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")

  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [rooms, setRooms] = useState(1)

  const [showGuests, setShowGuests] = useState(false)

  const handleSearch = (event) => {
    event.preventDefault()

    if (!destination.trim()) {
      return
    }

    if (checkIn && checkOut && checkOut < checkIn) {
      return
    }

    const searchParams = new URLSearchParams()

    searchParams.set("destination", destination.trim())

    if (checkIn) {
      searchParams.set("checkIn", checkIn)
    }

    if (checkOut) {
      searchParams.set("checkOut", checkOut)
    }

    searchParams.set("adults", adults)
    searchParams.set("children", children)
    searchParams.set("rooms", rooms)

    navigate(`/rooms?${searchParams.toString()}`)
  }

  const totalGuests = adults + children

  return (
    <form
      onSubmit={handleSearch}
      className="rounded-2xl border border-white/20 bg-background/95 p-3 shadow-2xl backdrop-blur-md"
    >
      <div className="grid gap-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr_auto]">
        {/* Destination */}
        <div className="relative flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
          <MapPin className="size-5 shrink-0 text-muted-foreground" />

          <div className="min-w-0 flex-1">
            <label
              htmlFor="destination"
              className="block text-xs font-medium text-muted-foreground"
            >
              Destination
            </label>

            <Input
              id="destination"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder="Where are you going?"
              className="h-7 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Check-in */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
          <CalendarDays className="size-5 shrink-0 text-muted-foreground" />

          <div className="min-w-0 flex-1">
            <label
              htmlFor="check-in"
              className="block text-xs font-medium text-muted-foreground"
            >
              Check-in
            </label>

            <Input
              id="check-in"
              type="date"
              value={checkIn}
              min={new Date().toISOString().split("T")[0]}
              onChange={(event) => setCheckIn(event.target.value)}
              className="h-7 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Check-out */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
          <CalendarDays className="size-5 shrink-0 text-muted-foreground" />

          <div className="min-w-0 flex-1">
            <label
              htmlFor="check-out"
              className="block text-xs font-medium text-muted-foreground"
            >
              Check-out
            </label>

            <Input
              id="check-out"
              type="date"
              value={checkOut}
              min={checkIn || new Date().toISOString().split("T")[0]}
              onChange={(event) => setCheckOut(event.target.value)}
              className="h-7 border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowGuests((current) => !current)}
            className="flex min-h-[66px] w-full items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-left transition-colors hover:bg-accent"
          >
            <Users className="size-5 shrink-0 text-muted-foreground" />

            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">
                Travelers
              </p>

              <p className="truncate text-sm font-medium">
                {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"} ·{" "}
                {rooms} {rooms === 1 ? "Room" : "Rooms"}
              </p>
            </div>
          </button>

          {showGuests && (
            <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-border bg-background p-4 shadow-xl">
              <GuestCounter
                label="Adults"
                description="Age 13+"
                value={adults}
                onDecrease={() =>
                  setAdults((current) => Math.max(1, current - 1))
                }
                onIncrease={() => setAdults((current) => current + 1)}
              />

              <GuestCounter
                label="Children"
                description="Age 0–12"
                value={children}
                onDecrease={() =>
                  setChildren((current) => Math.max(0, current - 1))
                }
                onIncrease={() => setChildren((current) => current + 1)}
              />

              <GuestCounter
                label="Rooms"
                description="Number of rooms"
                value={rooms}
                onDecrease={() =>
                  setRooms((current) => Math.max(1, current - 1))
                }
                onIncrease={() => setRooms((current) => current + 1)}
              />

              <Button
                type="button"
                variant="outline"
                className="mt-3 w-full"
                onClick={() => setShowGuests(false)}
              >
                Done
              </Button>
            </div>
          )}
        </div>

        {/* Search */}
        <Button
          type="submit"
          size="lg"
          className="min-h-[66px] rounded-xl px-6"
        >
          <Search />
          Search
        </Button>
      </div>
    </form>
  )
}

function GuestCounter({
  label,
  description,
  value,
  onDecrease,
  onIncrease,
}) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-b-0">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onDecrease}
          className="flex size-8 items-center justify-center rounded-full border border-border text-lg transition-colors hover:bg-accent"
          aria-label={`Decrease ${label}`}
        >
          −
        </button>

        <span className="w-5 text-center text-sm font-medium">
          {value}
        </span>

        <button
          type="button"
          onClick={onIncrease}
          className="flex size-8 items-center justify-center rounded-full border border-border text-lg transition-colors hover:bg-accent"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  )
}

export default TravelSearch