import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Compass,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Plane,
  ChevronRight,
  Filter,
} from "lucide-react";
import { api } from "@/lib/api";
import CustomerBookingCard from "@/components/bookings/BookingCard";
import { Button } from "@/components/ui/button";

function BookingSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white sm:flex-row dark:border-neutral-800 dark:bg-neutral-900">
      <div className="h-44 w-full bg-neutral-200 sm:h-auto sm:w-52 dark:bg-neutral-800" />
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="h-5 w-48 rounded-md bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-5 w-20 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          </div>
          <div className="h-4 w-32 rounded-md bg-neutral-200 dark:bg-neutral-800" />
          <div className="mt-4 grid grid-cols-4 gap-2 rounded-xl bg-neutral-100 p-3 dark:bg-neutral-800/60">
            <div className="h-8 rounded bg-neutral-200 dark:bg-neutral-700/50" />
            <div className="h-8 rounded bg-neutral-200 dark:bg-neutral-700/50" />
            <div className="h-8 rounded bg-neutral-200 dark:bg-neutral-700/50" />
            <div className="h-8 rounded bg-neutral-200 dark:bg-neutral-700/50" />
          </div>
        </div>
        <div className="mt-6 flex justify-between border-t border-neutral-100 pt-4 dark:border-neutral-800">
          <div className="h-6 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-9 w-28 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getMyBookings();
      if (res && res.success) {
        setBookings(res.bookings || []);
      } else {
        throw new Error(res?.message || "Failed to load bookings.");
      }
    } catch (err) {
      console.error("Error loading customer bookings:", err);
      setError(
        err.message || "Unable to load your bookings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter calculation
  const categorizedBookings = useMemo(() => {
    const now = new Date();

    const upcoming = bookings.filter((b) => {
      if (b.status === "cancelled" || b.status === "completed") return false;
      const checkOutDate = new Date(b.checkOut);
      return isNaN(checkOutDate.getTime()) || checkOutDate >= now;
    });

    const completed = bookings.filter((b) => {
      if (b.status === "completed") return true;
      if (b.status === "cancelled") return false;
      const checkOutDate = new Date(b.checkOut);
      return !isNaN(checkOutDate.getTime()) && checkOutDate < now;
    });

    const cancelled = bookings.filter((b) => b.status === "cancelled");

    return {
      all: bookings,
      upcoming,
      completed,
      cancelled,
    };
  }, [bookings]);

  const filteredBookings = categorizedBookings[activeFilter] || bookings;

  const filterTabs = [
    { key: "all", label: "All", count: categorizedBookings.all.length },
    {
      key: "upcoming",
      label: "Upcoming",
      count: categorizedBookings.upcoming.length,
    },
    {
      key: "completed",
      label: "Completed",
      count: categorizedBookings.completed.length,
    },
    {
      key: "cancelled",
      label: "Cancelled",
      count: categorizedBookings.cancelled.length,
    },
  ];

  return (
    <main className="min-h-screen bg-neutral-50/50 pb-24 pt-10 dark:bg-neutral-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-8 sm:flex-row sm:items-end dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span>Customer Trips</span>
            </div>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl dark:text-white">
              My Bookings
            </h1>
            <p className="mt-2 text-base text-neutral-600 dark:text-neutral-400">
              Manage your trips and bookings in one place.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/rooms">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-neutral-300 dark:border-neutral-700"
              >
                <Compass className="h-4 w-4" />
                Explore Rooms
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        {!loading && !error && bookings.length > 0 && (
          <div className="mt-6 flex overflow-x-auto border-b border-neutral-200 pb-px scrollbar-none dark:border-neutral-800">
            <div className="flex gap-2">
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveFilter(tab.key)}
                    className={`group inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-neutral-900 text-white shadow-xs dark:bg-white dark:text-neutral-950"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs transition-colors ${
                        isActive
                          ? "bg-neutral-700 text-white dark:bg-neutral-200 dark:text-neutral-950"
                          : "bg-neutral-200/80 text-neutral-600 group-hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-400"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className="mt-8">
          {/* Loading State */}
          {loading && (
            <div className="space-y-4">
              <BookingSkeleton />
              <BookingSkeleton />
              <BookingSkeleton />
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50/50 p-10 text-center dark:border-rose-900/40 dark:bg-rose-950/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-neutral-900 dark:text-white">
                Unable to load your bookings
              </h3>
              <p className="mt-1 max-w-md text-sm text-neutral-600 dark:text-neutral-400">
                {error}
              </p>
              <Button
                onClick={fetchBookings}
                variant="outline"
                className="mt-6 gap-2 border-rose-300 bg-white hover:bg-rose-100 dark:border-rose-800 dark:bg-neutral-900 dark:hover:bg-rose-950"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          )}

          {/* Empty State: No bookings at all */}
          {!loading && !error && bookings.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-20 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                <Calendar className="h-8 w-8" />
              </div>
              <h2 className="mt-5 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                No bookings yet
              </h2>
              <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-400">
                Your trips will appear here after you make a booking. Explore our
                curated destinations and reserve your dream stay!
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link to="/destinations">
                  <Button className="gap-2">
                    <Compass className="h-4 w-4" />
                    Explore Destinations
                  </Button>
                </Link>
                <Link to="/rooms">
                  <Button variant="outline">Browse Rooms</Button>
                </Link>
              </div>
            </div>
          )}

          {/* Empty State: Filter produced 0 results */}
          {!loading &&
            !error &&
            bookings.length > 0 &&
            filteredBookings.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white px-6 py-16 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                  <Filter className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-neutral-900 dark:text-white">
                  No {activeFilter} bookings
                </h3>
                <p className="mt-1 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
                  You don't have any {activeFilter} bookings at the moment.
                </p>
                <Button
                  onClick={() => setActiveFilter("all")}
                  variant="outline"
                  size="sm"
                  className="mt-5"
                >
                  Show All Bookings ({bookings.length})
                </Button>
              </div>
            )}

          {/* Bookings List Grid */}
          {!loading && !error && filteredBookings.length > 0 && (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <CustomerBookingCard key={booking._id} booking={booking} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default MyBookings;