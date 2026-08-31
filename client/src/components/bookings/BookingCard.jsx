import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  Moon,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatShortDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function StatusBadge({ status }) {
  const normalized = (status || "confirmed").toLowerCase();

  switch (normalized) {
    case "confirmed":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-500/30">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Confirmed
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-500/30">
          <Clock className="h-3.5 w-3.5" />
          Pending
        </span>
      );
    case "cancelled":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-600/20 dark:bg-rose-950/50 dark:text-rose-300 dark:ring-rose-500/30">
          <XCircle className="h-3.5 w-3.5" />
          Cancelled
        </span>
      );
    case "completed":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-600/20 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-500/30">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Completed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700 ring-1 ring-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700">
          {status}
        </span>
      );
  }
}

export function PaymentBadge({ paymentStatus }) {
  const normalized = (paymentStatus || "unpaid").toLowerCase();

  switch (normalized) {
    case "paid":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
          <CreditCard className="h-3 w-3" />
          Paid
        </span>
      );
    case "unpaid":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
          <CreditCard className="h-3 w-3" />
          Unpaid
        </span>
      );
    case "failed":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-500/20 dark:text-rose-300">
          <AlertCircle className="h-3 w-3" />
          Failed
        </span>
      );
    case "refunded":
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-500/20 dark:text-purple-300">
          <CreditCard className="h-3 w-3" />
          Refunded
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          {paymentStatus}
        </span>
      );
  }
}

function CustomerBookingCard({ booking }) {
  const property = booking.property || {};
  const room = booking.room || {};

  const image =
    room.images?.[0] ||
    property.images?.[0] ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80";

  const numCustomizations = booking.customizations?.length || 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs transition-all duration-200 hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/90 dark:hover:border-neutral-700">
      {/* Top Banner with Image & Essential Info */}
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail */}
        <div className="relative h-44 w-full shrink-0 overflow-hidden sm:h-auto sm:w-48 md:w-56">
          <img
            src={image}
            alt={property.name || room.name || "Booking image"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:hidden" />
          
          {/* Mobile status overlay */}
          <div className="absolute left-3 top-3 sm:hidden">
            <StatusBadge status={booking.status} />
          </div>
        </div>

        {/* Content Details */}
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          <div>
            {/* Header: Property, Room & Status */}
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                  {property.name || "Luxury Stay"}
                </h3>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                  {room.name || "Deluxe Suite"}
                </p>
                {property.location && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                    <MapPin className="h-3 w-3 shrink-0 text-neutral-400" />
                    {property.location}
                  </p>
                )}
              </div>

              <div className="hidden flex-col items-end gap-1.5 sm:flex">
                <StatusBadge status={booking.status} />
                <PaymentBadge paymentStatus={booking.paymentStatus} />
              </div>
            </div>

            {/* Mobile payment status */}
            <div className="mt-2 flex items-center justify-between sm:hidden">
              <span className="text-xs text-neutral-500">Payment:</span>
              <PaymentBadge paymentStatus={booking.paymentStatus} />
            </div>

            {/* Dates & Stay Info Strip */}
            <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-neutral-100 bg-neutral-50/70 p-3.5 text-xs sm:grid-cols-4 sm:gap-2 dark:border-neutral-800/60 dark:bg-neutral-800/40">
              <div>
                <span className="block text-neutral-400 dark:text-neutral-500">
                  Check-in
                </span>
                <span className="mt-0.5 block font-semibold text-neutral-800 dark:text-neutral-200">
                  {formatShortDate(booking.checkIn)}
                </span>
              </div>

              <div>
                <span className="block text-neutral-400 dark:text-neutral-500">
                  Check-out
                </span>
                <span className="mt-0.5 block font-semibold text-neutral-800 dark:text-neutral-200">
                  {formatShortDate(booking.checkOut)}
                </span>
              </div>

              <div>
                <span className="block text-neutral-400 dark:text-neutral-500">
                  Duration
                </span>
                <span className="mt-0.5 block font-semibold text-neutral-800 dark:text-neutral-200">
                  {booking.numberOfNights}{" "}
                  {booking.numberOfNights === 1 ? "Night" : "Nights"}
                </span>
              </div>

              <div>
                <span className="block text-neutral-400 dark:text-neutral-500">
                  Guests
                </span>
                <span className="mt-0.5 block font-semibold text-neutral-800 dark:text-neutral-200">
                  {booking.guests}{" "}
                  {booking.guests === 1 ? "Guest" : "Guests"}
                </span>
              </div>
            </div>

            {/* Customizations badge */}
            {numCustomizations > 0 && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>
                  + {numCustomizations}{" "}
                  {numCustomizations === 1 ? "customization" : "customizations"}{" "}
                  included
                </span>
              </div>
            )}
          </div>

          {/* Footer: Price & Action */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800/80">
            <div>
              <span className="text-xs text-neutral-400 dark:text-neutral-500">
                Total Price
              </span>
              <div className="text-xl font-bold text-neutral-900 dark:text-white">
                ₹{Number(booking.totalAmount || 0).toLocaleString("en-IN")}
              </div>
            </div>

            <Link to={`/bookings/${booking._id}`}>
              <Button
                variant="outline"
                size="sm"
                className="group/btn gap-1.5 border-neutral-200 bg-white font-medium text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-white dark:hover:text-neutral-900"
              >
                View Details
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerBookingCard;
