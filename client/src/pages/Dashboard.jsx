import { useUser } from "@clerk/react"

function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <p className="text-muted-foreground">
          Loading your dashboard...
        </p>
      </main>
    )
  }

  if (!isSignedIn) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">
            Sign in required
          </h1>

          <p className="mt-2 text-muted-foreground">
            Please sign in to access your dashboard.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Welcome back
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {user.firstName || "Traveler"}
          </h1>

          <p className="mt-4 text-muted-foreground">
            You are successfully authenticated with VAZHO.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border p-5">
              <p className="text-sm text-muted-foreground">
                User ID
              </p>

              <p className="mt-2 break-all text-sm font-medium">
                {user.id}
              </p>
            </div>

            <div className="rounded-xl border border-border p-5">
              <p className="text-sm text-muted-foreground">
                Email
              </p>

              <p className="mt-2 text-sm font-medium">
                {user.primaryEmailAddress?.emailAddress ||
                  "No email available"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Dashboard