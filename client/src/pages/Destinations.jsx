import { Compass } from "lucide-react"

import { destinations } from "../data/destinations"
import DestinationCard from "../components/destinations/DestinationCard"

function Destinations() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <Compass className="size-5 text-primary" />
            </div>

            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              VAZHO Destinations
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Find your next destination.
            </h1>

            <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
              Explore some of India&apos;s most popular destinations
              and discover places that match the way you want to travel.
            </p>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Destinations