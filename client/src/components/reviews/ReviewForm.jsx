import { useState } from "react";
import { Star } from "lucide-react";

import { createReview } from "@/services/reviewService";

function ReviewForm({ bookings = [], onCreated }) {
  const reviewableBookings = bookings.filter(
    (booking) => booking.status !== "cancelled" && booking.property?._id
  );
  const [bookingId, setBookingId] = useState(reviewableBookings[0]?._id || "");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!bookingId) {
      setError("Select a booking for this property.");
      return;
    }
    if (!comment.trim()) {
      setError("Comment is required.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await createReview({
        property: reviewableBookings.find((booking) => booking._id === bookingId).property._id,
        booking: bookingId,
        rating,
        comment: comment.trim(),
      });
      setComment("");
      setSuccess("Review submitted.");
      onCreated?.(response.review);
    } catch (err) {
      setError(err.message || "Unable to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!reviewableBookings.length) return null;

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
      <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Share your experience</h3>
      <label className="mt-5 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
        Booking
        <select value={bookingId} onChange={(event) => setBookingId(event.target.value)} className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 dark:border-neutral-700 dark:bg-neutral-950">
          {reviewableBookings.map((booking) => (
            <option key={booking._id} value={booking._id}>
              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
            </option>
          ))}
        </select>
      </label>
      <fieldset className="mt-5">
        <legend className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Rating</legend>
        <div className="mt-2 flex gap-1" aria-label="Select a rating from 1 to 5">
          {[1, 2, 3, 4, 5].map((value) => (
            <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} star${value > 1 ? "s" : ""}`} className="p-1">
              <Star className={`h-6 w-6 ${value <= rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-300 dark:text-neutral-600"}`} />
            </button>
          ))}
        </div>
      </fieldset>
      <label className="mt-5 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
        Comment
        <textarea value={comment} onChange={(event) => setComment(event.target.value)} rows="4" required className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 font-normal dark:border-neutral-700 dark:bg-neutral-950" placeholder="What stood out about your stay?" />
      </label>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-3 text-sm text-emerald-600">{success}</p>}
      <button type="submit" disabled={submitting} className="mt-5 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-900">
        {submitting ? "Submitting..." : "Submit review"}
      </button>
    </form>
  );
}

export default ReviewForm;
