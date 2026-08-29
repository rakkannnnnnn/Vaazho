import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Info,
  Loader2,
  ShieldCheck,
  Users,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "@/lib/api";
import CustomizationSelector, {
  calculateItemAmount,
} from "./CustomizationSelector";

function getTomorrowDateString(baseDate = new Date()) {
  const date = new Date(baseDate);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
}

function getTodayDateString() {
  return new Date().toISOString().split("T")[0];
}

function BookingCard({ room }) {
  const today = getTodayDateString();
  const defaultCheckIn = getTomorrowDateString(new Date());
  const defaultCheckOut = getTomorrowDateString(new Date(Date.now() + 86400000));

  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [guests, setGuests] = useState(1);

  const [customizations, setCustomizations] = useState([]);
  const [customizationsLoading, setCustomizationsLoading] = useState(true);
  const [customizationsError, setCustomizationsError] = useState("");
  const [selectedCustomizationIds, setSelectedCustomizationIds] = useState([]);

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Fetch customizations on mount
  useEffect(() => {
    let isMounted = true;
    const loadCustomizations = async () => {
      try {
        setCustomizationsLoading(true);
        setCustomizationsError("");
        const res = await api.getCustomizations();
        if (isMounted) {
          setCustomizations(res.customizations || []);
        }
      } catch (err) {
        if (isMounted) {
          setCustomizationsError("Could not load add-on customizations.");
        }
      } finally {
        if (isMounted) {
          setCustomizationsLoading(false);
        }
      }
    };

    loadCustomizations();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute number of nights
  const numberOfNights = useMemo(() => {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return 1;
    }
    const diffTime = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  // Compute room total
  const pricePerNight = Number(room?.pricePerNight ?? room?.price ?? 0);
  const roomTotal = pricePerNight * numberOfNights;

  // Compute selected customizations breakdown
  const selectedCustomizationDetails = useMemo(() => {
    return selectedCustomizationIds
      .map((id) => customizations.find((c) => c._id === id))
      .filter(Boolean)
      .map((item) => {
        const amount = calculateItemAmount(item, numberOfNights, guests);
        return {
          ...item,
          calculatedAmount: amount,
        };
      });
  }, [selectedCustomizationIds, customizations, numberOfNights, guests]);

  const customizationTotal = useMemo(() => {
    return selectedCustomizationDetails.reduce(
      (sum, item) => sum + item.calculatedAmount,
      0
    );
  }, [selectedCustomizationDetails]);

  const estimatedTotal = roomTotal + customizationTotal;

  // Toggle customization selection
  const handleToggleCustomization = (id) => {
    setSelectedCustomizationIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Handle date changes
  const handleCheckInChange = (newCheckIn) => {
    setCheckIn(newCheckIn);
    if (newCheckIn >= checkOut) {
      setCheckOut(getTomorrowDateString(new Date(newCheckIn)));
    }
  };

  // Handle booking submission
  const handleBookNow = async (e) => {
    e.preventDefault();
    if (!room?._id) return;

    try {
      setBookingLoading(true);
      setBookingError("");

      const payload = {
        roomId: room._id,
        checkIn,
        checkOut,
        guests: Number(guests),
        customizations: selectedCustomizationIds,
      };

      const response = await api.createBooking(payload);

      if (response.success && response.booking) {
        setConfirmedBooking(response.booking);
      } else {
        throw new Error(response.message || "Failed to create booking.");
      }
    } catch (err) {
      setBookingError(err.message || "Failed to complete reservation.");
    } finally {
      setBookingLoading(false);
    }
  };

  // If booking is confirmed, show confirmation summary
  if (confirmedBooking) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-300">
              Booking Confirmed!
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Booking Ref: #{confirmedBooking._id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4 rounded-xl border border-emerald-200 bg-white p-5 text-sm dark:border-emerald-900/40 dark:bg-neutral-900">
          <div className="flex justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
            <span className="text-neutral-500 dark:text-neutral-400">Dates</span>
            <span className="font-semibold text-neutral-900 dark:text-white">
              {new Date(confirmedBooking.checkIn).toLocaleDateString()} —{" "}
              {new Date(confirmedBooking.checkOut).toLocaleDateString()} (
              {confirmedBooking.numberOfNights}{" "}
              {confirmedBooking.numberOfNights === 1 ? "night" : "nights"})
            </span>
          </div>

          <div className="flex justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
            <span className="text-neutral-500 dark:text-neutral-400">Guests</span>
            <span className="font-semibold text-neutral-900 dark:text-white">
              {confirmedBooking.guests}{" "}
              {confirmedBooking.guests === 1 ? "guest" : "guests"}
            </span>
          </div>

          <div className="flex justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
            <span className="text-neutral-500 dark:text-neutral-400">
              Room (₹{confirmedBooking.pricePerNight} ×{" "}
              {confirmedBooking.numberOfNights} nights)
            </span>
            <span className="font-semibold text-neutral-900 dark:text-white">
              ₹{confirmedBooking.roomTotal}
            </span>
          </div>

          {confirmedBooking.customizations?.length > 0 && (
            <div className="border-b border-neutral-100 pb-3 dark:border-neutral-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Customizations Selected
              </span>
              <div className="mt-2 space-y-1.5">
                {confirmedBooking.customizations.map((c, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {c.name}{" "}
                      <span className="text-neutral-400">
                        ({c.pricingType})
                      </span>
                    </span>
                    <span className="font-medium text-neutral-900 dark:text-white">
                      ₹{c.calculatedAmount}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                <span>Customization Total</span>
                <span>₹{confirmedBooking.customizationTotal}</span>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-1 text-base font-bold text-neutral-900 dark:text-white">
            <span>Authoritative Total</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              ₹{confirmedBooking.totalAmount}
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            to="/bookings"
            className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
          >
            View My Bookings
            <ChevronRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => {
              setConfirmedBooking(null);
              setSelectedCustomizationIds([]);
            }}
            className="text-xs font-medium text-neutral-500 underline hover:text-neutral-800 dark:text-neutral-400"
          >
            Make another booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-baseline justify-between border-b border-neutral-100 pb-5 dark:border-neutral-800">
        <div>
          <span className="text-3xl font-bold text-neutral-900 dark:text-white">
            ₹{pricePerNight}
          </span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {" "}
            / night
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          Best price guaranteed
        </div>
      </div>

      <form onSubmit={handleBookNow} className="mt-5 space-y-5">
        {/* Date Selectors */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Check-In
            </label>
            <div className="mt-1.5 flex items-center rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800/50">
              <Calendar className="mr-2 h-4 w-4 text-neutral-400" />
              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => handleCheckInChange(e.target.value)}
                required
                className="w-full bg-transparent text-sm text-neutral-900 outline-none dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
              Check-Out
            </label>
            <div className="mt-1.5 flex items-center rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800/50">
              <Calendar className="mr-2 h-4 w-4 text-neutral-400" />
              <input
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
                className="w-full bg-transparent text-sm text-neutral-900 outline-none dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Guests Selector */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            Guests (Max {room?.capacity || 2})
          </label>
          <div className="mt-1.5 flex items-center rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800/50">
            <Users className="mr-2 h-4 w-4 text-neutral-400" />
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full bg-transparent text-sm text-neutral-900 outline-none dark:text-white"
            >
              {Array.from({ length: room?.capacity || 2 }, (_, i) => i + 1).map(
                (num) => (
                  <option
                    key={num}
                    value={num}
                    className="dark:bg-neutral-900 dark:text-white"
                  >
                    {num} {num === 1 ? "Guest" : "Guests"}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {/* Customization Add-ons */}
        <div className="border-t border-neutral-100 pt-5 dark:border-neutral-800">
          <CustomizationSelector
            customizations={customizations}
            selectedIds={selectedCustomizationIds}
            onToggleCustomization={handleToggleCustomization}
            loading={customizationsLoading}
            error={customizationsError}
            numberOfNights={numberOfNights}
            guests={guests}
          />
        </div>

        {/* Booking Price Breakdown Summary */}
        <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 space-y-2.5 text-sm dark:border-neutral-800 dark:bg-neutral-850/40">
          <div className="flex items-center justify-between font-semibold text-neutral-800 dark:text-neutral-200">
            <span className="text-xs uppercase tracking-wider text-neutral-500">
              Price Breakdown
            </span>
            <span className="text-xs text-neutral-400">
              {numberOfNights} {numberOfNights === 1 ? "night" : "nights"}
            </span>
          </div>

          <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
            <span>
              Room (₹{pricePerNight} × {numberOfNights} nights)
            </span>
            <span className="font-medium text-neutral-900 dark:text-white">
              ₹{roomTotal}
            </span>
          </div>

          {selectedCustomizationDetails.map((item) => (
            <div
              key={item._id}
              className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 pl-2 border-l-2 border-neutral-300 dark:border-neutral-700"
            >
              <span>
                {item.name}{" "}
                <span className="text-[11px] text-neutral-400">
                  ({item.pricingType === "per-night"
                    ? `₹${item.price} × ${numberOfNights} nights`
                    : item.pricingType === "per-person"
                    ? `₹${item.price} × ${guests} guests`
                    : `₹${item.price} flat`})
                </span>
              </span>
              <span className="font-medium text-neutral-900 dark:text-white">
                ₹{item.calculatedAmount}
              </span>
            </div>
          ))}

          {customizationTotal > 0 && (
            <div className="flex justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 pt-1 border-t border-neutral-200/70 dark:border-neutral-800">
              <span>Customizations Total</span>
              <span>₹{customizationTotal}</span>
            </div>
          )}

          <div className="flex justify-between pt-2 border-t border-neutral-200 dark:border-neutral-700 text-base font-bold text-neutral-900 dark:text-white">
            <span>Estimated Total</span>
            <span className="text-neutral-900 dark:text-white">
              ₹{estimatedTotal}
            </span>
          </div>

          <p className="flex items-center gap-1 text-[11px] text-neutral-400 pt-1">
            <Info className="h-3 w-3 shrink-0" />
            Backend verifies authoritative pricing upon reservation.
          </p>
        </div>

        {/* Error Alert */}
        {bookingError && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{bookingError}</span>
          </div>
        )}

        {/* Submit Booking Button */}
        <button
          type="submit"
          disabled={bookingLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
        >
          {bookingLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Calculating & Reserving...
            </>
          ) : (
            `Reserve for ₹${estimatedTotal}`
          )}
        </button>
      </form>
    </div>
  );
}

export default BookingCard;
