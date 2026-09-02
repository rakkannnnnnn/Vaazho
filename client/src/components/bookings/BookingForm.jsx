import { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Users } from "lucide-react";

import {
  checkAvailability,
  createBooking,
} from "@/services/bookingService";

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const getDateString = (date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next.toISOString().split("T")[0];
};

const getTomorrowDateString = (date) => {
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  return getDateString(next);
};

function BookingForm({ room }) {
  const [checkIn, setCheckIn] = useState(getDateString(getToday()));
  const [checkOut, setCheckOut] = useState(
    getTomorrowDateString(getToday())
  );
  const [guests, setGuests] = useState(2);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const canBook = useMemo(
    () => availability?.available && room?._id,
    [availability, room]
  );

  const handleCheckAvailability = async () => {
    if (!room?._id) {
      setError("Room details are unavailable.");
      return;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setError("Please enter valid check-in and check-out dates.");
      setAvailability(null);
      return;
    }

    if (end <= start) {
      setError("Check-out must be after check-in.");
      setAvailability(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await checkAvailability({
        roomId: room._id,
        checkIn,
        checkOut,
        guests: Number(guests),
      });

      if (!response?.success) {
        throw new Error(response?.message || "Unable to check availability.");
      }

      setAvailability(response);

      if (!response.available) {
        setError(response.message || "Room is unavailable for selected dates.");
      }
    } catch (err) {
      setAvailability(null);
      setError(err.message || "Unable to check availability.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = async () => {
    if (!room?._id || !canBook) {
      setError("This room is not available for the selected dates.");
      return;
    }

    try {
      setBookingLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        roomId: room._id,
        checkIn,
        checkOut,
        guests: Number(guests),
      };

      const response = await createBooking(payload);

      if (!response?.success || !response?.booking) {
        throw new Error(response?.message || "Booking failed.");
      }

      setSuccess("Booking created successfully.");
      setAvailability(null);
    } catch (err) {
      setError(err.message || "Failed to create booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
          Availability
        </p>
        <h3 className="mt-2 text-2xl font-bold text-neutral-900">
          Check your stay
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Check-in date
          </label>
          <input
            type="date"
            value={checkIn}
            min={getDateString(getToday())}
            onChange={(event) => {
              const nextCheckIn = event.target.value;
              setCheckIn(nextCheckIn);

              if (new Date(nextCheckIn) >= new Date(checkOut)) {
                setCheckOut(getTomorrowDateString(new Date(nextCheckIn)));
              }
            }}
            className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 focus:border-neutral-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Check-out date
          </label>
          <input
            type="date"
            value={checkOut}
            min={getTomorrowDateString(new Date(checkIn || getToday()))}
            onChange={(event) => setCheckOut(event.target.value)}
            className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-2.5 focus:border-neutral-900 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            Guests
          </label>
          <div className="relative">
            <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="number"
              min="1"
              max={room?.capacity || 10}
              value={guests}
              onChange={(event) => setGuests(Number(event.target.value) || 1)}
              className="w-full rounded-xl border border-neutral-300 bg-neutral-50 py-2.5 pl-10 pr-3 focus:border-neutral-900 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleCheckAvailability}
          disabled={loading}
          className="w-full rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Checking..." : "Check Availability"}
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          {success}
        </div>
      )}

      {availability && (
        <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Status</span>
            <span
              className={`font-semibold ${availability.available ? "text-emerald-600" : "text-red-600"}`}
            >
              {availability.available ? "Available" : "Unavailable"}
            </span>
          </div>

          {availability.available && availability.pricing && (
            <div className="mt-4 space-y-2 text-sm text-neutral-700">
              <div className="flex items-center justify-between">
                <span>Price per night</span>
                <span>₹{Number(availability.pricing.pricePerNight).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Number of nights</span>
                <span>{availability.pricing.numberOfNights}</span>
              </div>
              <div className="flex items-center justify-between font-semibold text-neutral-900">
                <span>Total amount</span>
                <span>₹{Number(availability.pricing.totalAmount).toLocaleString("en-IN")}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {availability?.available && (
        <button
          type="button"
          onClick={handleBookNow}
          disabled={bookingLoading}
          className="mt-5 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {bookingLoading ? "Booking..." : "Book Now"}
        </button>
      )}
    </div>
  );
}

export default BookingForm;
