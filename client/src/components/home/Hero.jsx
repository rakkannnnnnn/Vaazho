import { ArrowRight, Sparkles } from "lucide-react"
import { Link } from "react-router-dom"

import TravelSearch from "./TravelSearch"
import { Button } from "../ui/button"

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=2000&q=85')",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 -z-10 bg-black/50" />

      {/* Content */}
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
            <Sparkles className="size-4" />
            AI-powered travel planning
          </div>

          <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Plan Less.
            <br />
            Travel More.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 sm:text-xl">
            Discover destinations, find the perfect stay, and build a
            journey that fits your budget — all in one place.
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

            <Link to="/destinations">
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                Explore destinations
                <ArrowRight />
              </Button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mt-12 w-full">
          <TravelSearch />
        </div>
      </div>
    </section>
  )
}

export default Hero