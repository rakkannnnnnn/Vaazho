import { MapPin, Search, Sparkles } from "lucide-react"

import { Button } from "./components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card"
import { Input } from "./components/ui/input"

function App() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <section className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-widest">
            VAZHO
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Your journey starts here.
          </h1>

          <p className="max-w-2xl text-muted-foreground">
            AI-powered travel, accommodation and personalized trip planning.
          </p>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Explore your next destination</CardTitle>

            <CardDescription>
              Search for destinations and places to stay.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-1 items-center gap-2">
                <MapPin className="size-5" />

                <Input placeholder="Where are you going?" />
              </div>

              <Button>
                <Search />
                Search
              </Button>

              <Button variant="outline">
                <Sparkles />
                AI Planner
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default App