import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Users,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  Building,
  Bed,
  Maximize2,
  ShieldCheck,
  Receipt,
  Loader2,
  RefreshCw,
  Info,
} from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge, PaymentBadge } from "@/components/bookings/BookingCard";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function BookingDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-6 w-36 rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="mt-6 flex justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-4 w-40 rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="h-8 w-28 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="h-64 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-48 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="h-96 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  );
}

function BookingDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cancellation state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [cancelSuccessMessage, setCancelSuccessMessage] = useState("");

  const loadBooking = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getBookingById(bookingId);
      if (res && res.success && res.booking) {
        setBooking(res.booking);
      } else {
        throw new Error(res?.message || "Booking not found.");
      }
    } catch (err) {
      console.error("Error loading booking details:", err);
      setError(
        err.message || "Unable to load booking details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookingId) {
      loadBooking();
    }
  }, [bookingId]);

  const handleConfirmCancel = async () => {
    try {
      setCancelling(true);
      setCancelError("");
      const res = await api.cancelBooking(bookingId);
      if (res && res.success) {
        setBooking(res.booking);
        setCancelSuccessMessage("Booking cancelled successfully.");
        setCancelModalOpen(false);
      } else {
        throw new Error(res?.message || "Failed to cancel booking.");
      }
    } catch (err) {
      setCancelError(err.message || "Failed to cancel booking.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <BookingDetailsSkeleton />;
  }

  if (error || !booking) {
    return (
      <main className="min-h-[70vh] bg-neutral-50/50 px-4 py-16 sm:px-6 lg:px-8 dark:bg-neutral-950">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Booking Details Unavailable
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            {error || "We could not find the requested booking record."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={() => navigate("/bookings")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to My Bookings
            </Button>
            <Button onClick={loadBooking}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const property = booking.property || {};
  const room = booking.room || {};
  const isCancellable =
    booking.status !== "cancelled" && booking.status !== "completed";

  const bookingRef = (booking._id || "").slice(-8).toUpperCase();
  const propertyImage =
    property.images?.[0] ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80";
  const roomImage =
    room.images?.[0] ||
    propertyImage;

  return (
    <main className="min-h-screen bg-neutral-50/50 pb-24 pt-8 dark:bg-neutral-950">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/bookings"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Bookings
          </Link>

          <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500">
            Ref: #{bookingRef}
          </span>
        </div>

        {/* Success Alert if just cancelled */}
        {cancelSuccessMessage && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              <span>{cancelSuccessMessage}</span>
            </div>
            <button
              onClick={() => setCancelSuccessMessage("")}
              className="text-xs font-semibold underline hover:opacity-75"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Page Header */}
        <div className="mt-6 flex flex-col justify-between gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-center dark:border-neutral-800">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 sm:text-3xl dark:text-white">
                Booking #{bookingRef}
              </h1>
              <StatusBadge status={booking.status} />
              <PaymentBadge paymentStatus={booking.paymentStatus} />
            </div>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              Reserved on {formatDate(booking.createdAt)}
            </p>
          </div>

          {/* Cancellation button in header for desktop */}
          {isCancellable && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setCancelModalOpen(true)}
              className="w-full sm:w-auto"
            >
              Cancel Booking
            </Button>
          )}
        </div>

        {/* Main Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Property, Room & Stay Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Property & Room Hero Card */}
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
              <div className="relative h-64 w-full">
                <img
                  src={roomImage}
                  alt={room.name || property.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md">
                    {room.type || "Suite"}
                  </span>
                  <h2 className="mt-1.5 text-xl font-bold sm:text-2xl">
                    {room.name || "Room Details"}
                  </h2>
                  <p className="flex items-center gap-1.5 text-sm text-neutral-200">
                    <Building className="h-4 w-4 shrink-0" />
                    {property.name}
                  </p>
                </div>
              </div>

              <div className="p-6">
                {property.location && (
                  <div className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {property.location}
                      </p>
                      {property.address && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {property.address}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Room Specs */}
                <div className="mt-6 grid grid-cols-3 gap-3 border-t border-neutral-100 pt-5 text-center dark:border-neutral-800">
                  {room.bedType && (
                    <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800/50">
                      <Bed className="mx-auto h-4 w-4 text-neutral-500" />
                      <span className="mt-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        {room.bedType}
                      </span>
                    </div>
                  )}
                  {room.roomSize && (
                    <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800/50">
                      <Maximize2 className="mx-auto h-4 w-4 text-neutral-500" />
                      <span className="mt-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                        {room.roomSize} sq ft
                      </span>
                    </div>
                  )}
                  <div className="rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800/50">
                    <Users className="mx-auto h-4 w-4 text-neutral-500" />
                    <span className="mt-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Max {room.capacity || booking.guests} Guests
                    </span>
                  </div>
                </div>

                {property.slug && (
                  <div className="mt-5 border-t border-neutral-100 pt-4 dark:border-neutral-800">
                    <Link
                      to={`/properties/${property.slug}`}
                      className="text-xs font-semibold text-neutral-900 underline hover:text-neutral-700 dark:text-neutral-200"
                    >
                      View Full Property Page →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Stay Itinerary Card */}
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
              <h3 className="flex items-center gap-2 text-base font-bold text-neutral-900 dark:text-white">
                <Calendar className="h-4 w-4 text-neutral-500" />
                Stay Details
              </h3>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/30">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Check-in
                  </span>
                  <p className="mt-1 text-base font-bold text-neutral-900 dark:text-white">
                    {formatDate(booking.checkIn)}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                    <Clock className="h-3 w-3" />
                    From 2:00 PM
                  </p>
                </div>

                <div className="rounded-xl border border-neutral-100 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-800/30">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Check-out
                  </span>
                  <p className="mt-1 text-base font-bold text-neutral-900 dark:text-white">
                    {formatDate(booking.checkOut)}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                    <Clock className="h-3 w-3" />
                    Until 11:00 AM
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3 text-xs text-neutral-600 dark:bg-neutral-800/40 dark:text-neutral-300">
                <span>
                  Length of stay:{" "}
                  <strong>
                    {booking.numberOfNights}{" "}
                    {booking.numberOfNights === 1 ? "Night" : "Nights"}
                  </strong>
                </span>
                <span>
                  Reserved for:{" "}
                  <strong>
                    {booking.guests}{" "}
                    {booking.guests === 1 ? "Guest" : "Guests"}
                  </strong>
                </span>
              </div>
            </div>

            {/* Customizations Card */}
            {booking.customizations && booking.customizations.length > 0 && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                <h3 className="flex items-center gap-2 text-base font-bold text-neutral-900 dark:text-white">
                  <Sparkles className="h-4 w-4 text-indigo-500" />
                  Selected Add-ons & Customizations ({booking.customizations.length})
                </h3>

                <div className="mt-4 divide-y divide-neutral-100 dark:divide-neutral-800">
                  {booking.customizations.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-3 text-sm first:pt-0 last:pb-0"
                    >
                      <div>
                        <p className="font-semibold text-neutral-900 dark:text-white">
                          {item.name}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          ₹{item.price} • {item.pricingType}
                        </p>
                      </div>
                      <span className="font-bold text-neutral-900 dark:text-white">
                        ₹{item.calculatedAmount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Price Breakdown & Cancellation */}
          <div className="space-y-6">
            {/* Price Breakdown Card */}
            <div className="sticky top-24 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
              <h3 className="flex items-center gap-2 text-base font-bold text-neutral-900 dark:text-white">
                <Receipt className="h-4 w-4 text-neutral-500" />
                Price Summary
              </h3>

              <div className="mt-5 space-y-3.5 border-b border-neutral-100 pb-5 text-sm dark:border-neutral-800">
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Room (₹{booking.pricePerNight} × {booking.numberOfNights}{" "}
                    {booking.numberOfNights === 1 ? "night" : "nights"})
                  </span>
                  <span className="font-medium text-neutral-900 dark:text-white">
                    ₹{booking.roomTotal}
                  </span>
                </div>

                {booking.customizations && booking.customizations.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Customizations Total
                    </span>
                    <span className="font-medium text-neutral-900 dark:text-white">
                      ₹{booking.customizationTotal || 0}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Taxes & Service Fees</span>
                  <span>Included</span>
                </div>
              </div>

              {/* Total Amount */}
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Total Amount
                  </span>
                  <div className="text-2xl font-black text-neutral-900 dark:text-white">
                    ₹{Number(booking.totalAmount || 0).toLocaleString("en-IN")}
                  </div>
                </div>
                <PaymentBadge paymentStatus={booking.paymentStatus} />
              </div>

              {/* Cancellation policy note */}
              <div className="mt-6 rounded-xl bg-neutral-50 p-3.5 text-xs text-neutral-500 dark:bg-neutral-800/40 dark:text-neutral-400">
                <p className="flex items-start gap-1.5 font-medium">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  Free cancellation prior to check-in.
                </p>
                <p className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
                  Cancellations are saved to your booking record.
                </p>
              </div>

              {/* Mobile / sidebar cancel button */}
              {isCancellable && (
                <div className="mt-6 pt-2">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setCancelModalOpen(true)}
                  >
                    Cancel Booking
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Confirmation Dialog */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
              <AlertCircle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center text-lg font-bold">
              Cancel this booking?
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-neutral-600 dark:text-neutral-400">
              Are you sure you want to cancel your reservation at{" "}
              <strong>{property.name}</strong> for {formatDate(booking.checkIn)}?
            </DialogDescription>
          </DialogHeader>

          {cancelError && (
            <div className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
              {cancelError}
            </div>
          )}

          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              disabled={cancelling}
              onClick={() => setCancelModalOpen(false)}
            >
              Keep Booking
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={cancelling}
              onClick={handleConfirmCancel}
              className="gap-2"
            >
              {cancelling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel Booking"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default BookingDetails;
