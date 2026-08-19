import {
  ArrowRight,
  Check,
  Clock3,
  IndianRupee,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react"

import { Button } from "../ui/button"

function AIResults({ trip, onStartOver }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="size-3.5" />
              AI recommendation
            </div>

            <h2 className="text-3xl font-bold tracking-tight">
              Your {trip.duration}-day trip
            </h2>

            <p className="mt-2 text-muted-foreground">
              Based on your budget, travel style and preferences.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={onStartOver}
          >
            Start over
          </Button>
        </div>
      </div>

      {/* Destination */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div
          className="h-64 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1600&q=85')",
          }}
        />

        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4" />
            Recommended destination
          </div>

          <h3 className="mt-2 text-3xl font-bold">
            Coorg, Karnataka
          </h3>

          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            A peaceful destination surrounded by coffee estates,
            waterfalls and lush green landscapes. It is a strong match
            for your {trip.style.toLowerCase()} travel preference.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <InfoItem
              icon={IndianRupee}
              label="Estimated budget"
              value={`₹${trip.budget.toLocaleString("en-IN")}`}
            />

            <InfoItem
              icon={Users}
              label="Travelers"
              value={`${trip.travelers} ${
                trip.travelers === 1 ? "person" : "people"
              }`}
            />

            <InfoItem
              icon={Clock3}
              label="Duration"
              value={`${trip.duration} days`}
            />
          </div>
        </div>
      </div>

      {/* Why this destination */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-xl font-semibold">
          Why VAZHO recommends this
        </h3>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Reason text="Fits your approximate budget" />
          <Reason text={`Matches your ${trip.style.toLowerCase()} style`} />
          <Reason text="Suitable for your group size" />
          <Reason text="Works well for your trip duration" />
        </div>
      </div>

      {/* Itinerary preview */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">
              Suggested itinerary
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              A preview of what your AI-generated trip could look like.
            </p>
          </div>

          <Sparkles className="size-5 text-muted-foreground" />
        </div>

        <div className="mt-6 space-y-4">
          {[
            ["Day 1", "Arrival and local exploration"],
            ["Day 2", "Nature and sightseeing"],
            ["Day 3", "Adventure and local experiences"],
            ["Day 4", "Relaxation and food experiences"],
            ["Day 5", "Final exploration and departure"],
          ]
            .slice(0, trip.duration)
            .map(([day, title]) => (
              <div
                key={day}
                className="flex gap-4 rounded-xl border border-border p-4"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {day.replace("Day ", "D")}
                </div>

                <div>
                  <p className="font-medium">{day}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {title}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-bold">
              Ready to build this trip?
            </h3>

            <p className="mt-2 max-w-xl text-primary-foreground/75">
              Next, VAZHO can help you find accommodation and
              organize the rest of your journey.
            </p>
          </div>

          <Button
            size="lg"
            variant="secondary"
            className="shrink-0"
          >
            Build My Trip
            <ArrowRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <Icon className="size-5 text-muted-foreground" />

      <p className="mt-3 text-xs text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 font-semibold">
        {value}
      </p>
    </div>
  )
}

function Reason({ text }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Check className="size-3.5 text-primary" />
      </div>

      <p className="text-sm text-muted-foreground">
        {text}
      </p>
    </div>
  )
}

export default AIResults