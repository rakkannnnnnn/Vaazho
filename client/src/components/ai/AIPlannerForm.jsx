import {
  CalendarDays,
  Compass,
  IndianRupee,
  Map,
  Users,
} from "lucide-react"
import { useState } from "react"

import { Button } from "../ui/button"
import { Input } from "../ui/input"

const travelStyles = [
  "Nature",
  "Adventure",
  "Beach",
  "Culture",
  "Food",
  "Relaxation",
  "Luxury",
]

function AIPlannerForm({ onGenerate, isGenerating }) {
  const [budget, setBudget] = useState("")
  const [travelers, setTravelers] = useState(2)
  const [duration, setDuration] = useState(5)
  const [style, setStyle] = useState("Nature")
  const [region, setRegion] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!budget || Number(budget) <= 0) {
      return
    }

    if (!region.trim()) {
      return
    }

    onGenerate({
      budget: Number(budget),
      travelers,
      duration,
      style,
      region: region.trim(),
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7"
    >
      {/* Budget */}
      <div className="space-y-2">
        <label
          htmlFor="ai-budget"
          className="text-sm font-medium"
        >
          What's your budget?
        </label>

        <div className="relative">
          <IndianRupee className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            id="ai-budget"
            type="number"
            min="1"
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            placeholder="Example: 25000"
            className="pl-9"
          />
        </div>

        <p className="text-xs text-muted-foreground">
          Enter your approximate total trip budget.
        </p>
      </div>

      {/* Travelers */}
      <div className="space-y-2">
        <label
          htmlFor="ai-travelers"
          className="text-sm font-medium"
        >
          How many travelers?
        </label>

        <div className="flex items-center gap-3 rounded-xl border border-border p-3">
          <Users className="size-5 text-muted-foreground" />

          <Input
            id="ai-travelers"
            type="number"
            min="1"
            max="20"
            value={travelers}
            onChange={(event) =>
              setTravelers(
                Math.max(1, Number(event.target.value) || 1),
              )
            }
            className="border-0 p-0 shadow-none focus-visible:ring-0"
          />

          <span className="text-sm text-muted-foreground">
            people
          </span>
        </div>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <label
          htmlFor="ai-duration"
          className="text-sm font-medium"
        >
          How long is your trip?
        </label>

        <div className="flex items-center gap-3 rounded-xl border border-border p-3">
          <CalendarDays className="size-5 text-muted-foreground" />

          <Input
            id="ai-duration"
            type="number"
            min="1"
            max="30"
            value={duration}
            onChange={(event) =>
              setDuration(
                Math.max(1, Number(event.target.value) || 1),
              )
            }
            className="border-0 p-0 shadow-none focus-visible:ring-0"
          />

          <span className="text-sm text-muted-foreground">
            days
          </span>
        </div>
      </div>

      {/* Travel style */}
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium">
            What kind of trip do you want?
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Choose the experience that best matches you.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {travelStyles.map((item) => {
            const selected = style === item

            return (
              <button
                key={item}
                type="button"
                onClick={() => setStyle(item)}
                className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-accent"
                }`}
              >
                {item}
              </button>
            )
          })}
        </div>
      </div>

      {/* Region */}
      <div className="space-y-2">
        <label
          htmlFor="ai-region"
          className="text-sm font-medium"
        >
          Any preferred region?
        </label>

        <div className="relative">
          <Map className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            id="ai-region"
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            placeholder="Example: South India"
            className="pl-9"
          />
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isGenerating}
      >
        <Compass />

        {isGenerating
          ? "Creating your trip..."
          : "Generate My Trip"}
      </Button>
    </form>
  )
}

export default AIPlannerForm