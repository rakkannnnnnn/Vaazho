import {
  ArrowLeft,
  MapPin,
  Sparkles,
} from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { destinations } from "../data/destinations"
import { Button } from "../components/ui/button"

function DestinationDetail() {
  const { slug } = useParams()

  const destination = destinations.find(
    (item) => item.slug === slug,
  )

  if (!destination) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            Destination not found
          </h1>

          <p className="mt-3 text-muted-foreground">
            We couldn&apos;t find the destination you&apos;re looking for.
          </p>

          <Link
            to="/destinations"
            className="mt-6 inline-block"
          >
            <Button>
              <ArrowLeft />
              Back to destinations
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage: `url("${destination.image}")`,
          }}
        />

        <div className="absolute inset-0 -z-10 bg-black/55" />

        <div className="mx-auto flex min-h-[500px] max-w-7xl items-end px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <Link
              to="/destinations"
              className="mb-6 inline-flex items-center gap-2 text-sm text-white/80 transition-colors hover:text-white"
            >
              <ArrowLeft className="size-4" />
              Back to destinations
            </Link>

            <div className="flex items-center gap-2 text-sm text-white/75">
              <MapPin className="size-4" />
              India
            </div>

            <h1 className="mt-3 text-5xl font-bold tracking-tight sm:text-6xl">
              {destination.name}
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85">
              {destination.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/ai-planner">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-white/90"
                >
                  <Sparkles />
                  Plan with AI
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Temporary information */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <InfoCard
              title="Explore"
              description="Popular attractions and experiences will be connected here."
            />

            <InfoCard
              title="Where to stay"
              description="Recommended properties and available rooms will be added later."
            />

            <InfoCard
              title="Plan your trip"
              description="Use VAZHO AI to build a personalized journey."
            />
          </div>
        </div>
      </section>
    </main>
  )
}

function InfoCard({ title, description }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

export default DestinationDetail