import { Star } from "lucide-react";

function ReviewList({ reviews = [], averageRating = 0, reviewCount = 0 }) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Guest reviews</p>
          <h2 className="mt-3 text-3xl font-bold text-neutral-900 dark:text-white">What guests say</h2>
        </div>
        <div className="flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          {averageRating.toFixed(2)} <span className="text-sm font-normal text-neutral-500">Based on {reviewCount} reviews</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="mt-6 text-neutral-600 dark:text-neutral-400">No reviews yet. Be the first to share your experience.</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <article key={review._id} className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-neutral-900 dark:text-white">{review.user?.name || "Guest"}</p>
                <div className="flex items-center gap-1 text-sm font-semibold"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> {review.rating}/5</div>
              </div>
              <p className="mt-2 text-xs text-neutral-500">{new Date(review.createdAt).toLocaleDateString()}</p>
              <p className="mt-4 leading-7 text-neutral-700 dark:text-neutral-300">{review.comment}</p>
              {review.ownerResponse && (
                <div className="mt-4 border-l-2 border-neutral-300 pl-4 text-sm dark:border-neutral-700">
                  <p className="font-semibold text-neutral-900 dark:text-white">Owner response</p>
                  <p className="mt-1 text-neutral-600 dark:text-neutral-400">{review.ownerResponse}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewList;
