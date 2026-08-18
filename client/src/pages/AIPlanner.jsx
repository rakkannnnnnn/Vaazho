import { Sparkles } from "lucide-react"

function AIPlanner() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-6">
      <div className="text-center">
        <Sparkles className="mx-auto mb-4 size-8" />

        <h1 className="text-3xl font-bold">
          AI Trip Planner
        </h1>

        <p className="mt-3 text-muted-foreground">
          Your personalized AI travel planner will be built here.
        </p>
      </div>
    </main>
  )
}

export default AIPlanner