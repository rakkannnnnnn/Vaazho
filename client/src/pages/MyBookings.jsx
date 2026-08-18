import { CalendarCheck } from "lucide-react"

function MyBookings() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-6">
      <div className="text-center">
        <CalendarCheck className="mx-auto mb-4 size-8" />

        <h1 className="text-3xl font-bold">
          My Bookings
        </h1>

        <p className="mt-3 text-muted-foreground">
          Your bookings will appear here after authentication and booking
          functionality are implemented.
        </p>
      </div>
    </main>
  )
}

export default MyBookings