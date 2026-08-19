import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

import { destinations } from "../../data/destinations"
import DestinationCard from "./DestinationCard"
import { Button } from "../ui/button"

function PopularDestinations() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Explore India
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Popular Destinations
            </h2>

            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Discover places worth experiencing, from mountain
              escapes and coastal retreats to heritage cities and
              peaceful hill stations.
            </p>
          </div>

          <Link
            to="/destinations"
            className="shrink-0"
          >
            <Button variant="outline">
              View all destinations
              <ArrowRight />
            </Button>
          </Link>
        </div>

        {/* Destination grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularDestinations