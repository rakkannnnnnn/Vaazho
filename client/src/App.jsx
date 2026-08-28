import { Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

function App() {
  return (
    <>
      <main className="min-h-screen bg-neutral-50 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          
          {/* Header */}
          <div className="mb-12">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-neutral-500">
              VAZHO
            </p>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Plan less. Travel more.
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-neutral-600">
              Your AI-powered travel and accommodation companion.
            </p>
          </div>

          {/* Component Test */}
          <Card className="max-w-xl">
            <CardHeader>
              <CardTitle>Find your journey</CardTitle>

              <CardDescription>
                Search for your next destination.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <Input placeholder="Where are you going?" />

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="flex-1">
                  <Search />
                  Search
                </Button>

                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    toast.success("AI Planner coming next.")
                  }
                >
                  <Sparkles />
                  AI Planner
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>

      <Toaster />
    </>
  );
}

export default App;