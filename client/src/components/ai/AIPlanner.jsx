import { useState } from "react";
import { generateTravelPlan } from "@/services/aiService";

function AIPlanner() {
  const [formData, setFormData] = useState({
    destination: "",
    days: 3,
    travelers: 2,
    budget: "medium",
    interests: "",
  });

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.destination.trim()) {
      setError("Please enter a destination.");
      return;
    }

    if (!formData.interests.trim()) {
      setError("Please enter your interests.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setPlan(null);

      const result = await generateTravelPlan({
        destination: formData.destination,
        days: Number(formData.days),
        travelers: Number(formData.travelers),
        budget: formData.budget,
        interests: formData.interests,
      });

      setPlan(result.data);
    } catch (err) {
      console.error("AI planner error:", err);

      setError(
        err.message || "Unable to generate your travel plan."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-neutral-900">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mx-auto max-w-3xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500">
            VAZHO AI
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Plan your perfect trip
          </h1>

          <p className="mt-4 text-lg text-neutral-600">
            Tell VAZHO where you want to go and what you love.
            We'll create a personalized travel plan for you.
          </p>

        </div>

        {/* FORM */}

        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* DESTINATION */}

            <div>
              <label
                htmlFor="destination"
                className="block text-sm font-semibold"
              >
                Destination
              </label>

              <input
                id="destination"
                name="destination"
                type="text"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Example: Jaipur"
                className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            {/* DAYS + TRAVELERS */}

            <div className="grid gap-6 sm:grid-cols-2">

              <div>
                <label
                  htmlFor="days"
                  className="block text-sm font-semibold"
                >
                  Number of days
                </label>

                <input
                  id="days"
                  name="days"
                  type="number"
                  min="1"
                  max="30"
                  value={formData.days}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label
                  htmlFor="travelers"
                  className="block text-sm font-semibold"
                >
                  Travelers
                </label>

                <input
                  id="travelers"
                  name="travelers"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.travelers}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

            </div>

            {/* BUDGET */}

            <div>

              <label
                htmlFor="budget"
                className="block text-sm font-semibold"
              >
                Budget
              </label>

              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-black"
              >
                <option value="low">
                  Budget
                </option>

                <option value="medium">
                  Moderate
                </option>

                <option value="high">
                  Luxury
                </option>
              </select>

            </div>

            {/* INTERESTS */}

            <div>

              <label
                htmlFor="interests"
                className="block text-sm font-semibold"
              >
                Interests
              </label>

              <textarea
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Example: forts, food, shopping, culture, photography"
                rows={4}
                className="mt-2 w-full resize-none rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-black"
              />

            </div>

            {/* ERROR */}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black px-6 py-4 font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Creating your travel plan..."
                : "Create My Travel Plan"}
            </button>

          </form>

        </div>

        {/* RESULT */}

        {plan && (
          <div className="mx-auto mt-12 max-w-4xl">

            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">

              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
                  Your VAZHO Plan
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {plan.title || `${formData.destination} Travel Plan`}
                </h2>
              </div>

              {plan.summary && (
                <p className="mt-4 leading-7 text-neutral-600">
                  {plan.summary}
                </p>
              )}

              {Array.isArray(plan.days) &&
                plan.days.length > 0 && (
                  <div className="mt-10 space-y-6">

                    {plan.days.map((day, index) => (
                      <div
                        key={index}
                        className="rounded-2xl border border-neutral-200 p-6"
                      >

                        <h3 className="text-xl font-bold">
                          {day.title ||
                            `Day ${index + 1}`}
                        </h3>

                        {day.description && (
                          <p className="mt-2 text-neutral-600">
                            {day.description}
                          </p>
                        )}

                        {Array.isArray(day.activities) &&
                          day.activities.length > 0 && (
                            <ul className="mt-4 space-y-3">
                              {day.activities.map(
                                (activity, activityIndex) => (
                                  <li
                                    key={activityIndex}
                                    className="flex gap-3 text-neutral-700"
                                  >
                                    <span className="mt-1">
                                      •
                                    </span>

                                    <span>
                                      {typeof activity ===
                                      "string"
                                        ? activity
                                        : activity.name ||
                                          activity.title ||
                                          JSON.stringify(
                                            activity
                                          )}
                                    </span>
                                  </li>
                                )
                              )}
                            </ul>
                          )}

                      </div>
                    ))}

                  </div>
                )}

              {Array.isArray(plan.tips) &&
                plan.tips.length > 0 && (
                  <div className="mt-10">

                    <h3 className="text-xl font-bold">
                      Travel Tips
                    </h3>

                    <ul className="mt-4 list-disc space-y-2 pl-5 text-neutral-600">
                      {plan.tips.map((tip, index) => (
                        <li key={index}>
                          {tip}
                        </li>
                      ))}
                    </ul>

                  </div>
                )}

            </div>

          </div>
        )}

      </div>
    </main>
  );
}

export default AIPlanner;