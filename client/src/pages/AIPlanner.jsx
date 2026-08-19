import { Sparkles } from "lucide-react"
import { useState } from "react"

import AIPlannerForm from "../components/ai/AIPlannerForm"
import AIResults from "../components/ai/AIResults"

function AIPlanner() {
  const [trip, setTrip] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = (preferences) => {
    setIsGenerating(true)

    // Temporary mock AI response.
    // Real AI integration will be added later.
    setTimeout(() => {
      setTrip(preferences)
      setIsGenerating(false)
    }, 1500)
  }

  const handleStartOver = () => {
    setTrip(null)
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {!trip ? (
          <>
            {/* Intro */}
            <section className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary/10">
                <Sparkles className="size-6 text-primary" />
              </div>

              <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                VAZHO AI
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                Let AI plan your journey.
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Tell us what you want from your trip. VAZHO will
                use your preferences to create a personalized travel
                recommendation.
              </p>
            </section>

            {/* Form */}
            <section className="mx-auto mt-10 max-w-2xl">
              <AIPlannerForm
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
            </section>
          </>
        ) : (
          <AIResults
            trip={trip}
            onStartOver={handleStartOver}
          />
        )}
      </div>
    </main>
  )
}

export default AIPlanner