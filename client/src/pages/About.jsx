import {
  Brain,
  Compass,
  Heart,
  Sparkles,
} from "lucide-react"

import PageHeader from "../components/layout/PageHeader"

const features = [
  {
    icon: Compass,
    title: "Discover",
    description:
      "Explore destinations, properties and travel experiences across India.",
  },
  {
    icon: Sparkles,
    title: "Plan with AI",
    description:
      "Get personalized travel suggestions based on your budget, duration and preferences.",
  },
  {
    icon: Heart,
    title: "Personalize",
    description:
      "Customize your stay with food preferences, activities and special experiences.",
  },
  {
    icon: Brain,
    title: "Travel Smarter",
    description:
      "VAZHO brings planning, accommodation and intelligent trip assistance together.",
  },
]

function About() {
  return (
    <main>
      <PageHeader
        eyebrow="About VAZHO"
        title="Plan less. Travel more."
        description="VAZHO is an AI-powered travel and accommodation platform designed to make planning a complete journey simpler, smarter and more personalized."
      />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 text-base leading-8 text-muted-foreground">
            <p>
              VAZHO combines destination discovery, accommodation,
              personalized stays and AI-powered travel planning in one
              platform.
            </p>

            <p>
              Instead of simply finding a room, users can discover where
              to go, decide where to stay, customize their experience
              and build a practical trip plan around their budget.
            </p>

            <p>
              The goal is simple: make travel planning easier without
              taking away the freedom of choosing how you want to travel.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/30 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-border bg-background p-6 shadow-sm"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>

                  <h2 className="mt-5 text-lg font-semibold">
                    {feature.title}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}

export default About