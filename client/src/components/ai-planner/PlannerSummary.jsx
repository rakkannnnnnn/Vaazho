function PlannerSummary({
  budget,
  travelers,
  duration,
  interests,
  food,
  travelStyle,
}) {
  const hasDetails =
    budget ||
    travelers ||
    duration ||
    interests.length > 0 ||
    food ||
    travelStyle;

  if (!hasDetails) {
    return null;
  }

  return (
    <div className="rounded-2xl border bg-neutral-50 p-5">
      <p className="text-sm font-semibold">
        Your trip preferences
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {budget && (
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium">
            ₹{budget} budget
          </span>
        )}

        {travelers && (
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium">
            {travelers} traveler
            {Number(travelers) !== 1 ? "s" : ""}
          </span>
        )}

        {duration && (
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium">
            {duration} days
          </span>
        )}

        {food && (
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium">
            {food}
          </span>
        )}

        {travelStyle && (
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium">
            {travelStyle}
          </span>
        )}

        {interests.map((interest) => (
          <span
            key={interest}
            className="rounded-full bg-white px-3 py-1.5 text-xs font-medium"
          >
            {interest}
          </span>
        ))}
      </div>
    </div>
  );
}

export default PlannerSummary;