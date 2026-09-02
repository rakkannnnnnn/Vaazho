import { useState } from "react";
import { generateTravelPlan, saveAIPlan } from "@/services/aiService";

function AIPlanner() {
  const [form, setForm] = useState({
    destination: "",
    days: 3,
    travelers: 2,
    budget: "medium",
    interests: "",
  });

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleGenerate = async (event) => {
    event.preventDefault();

    if (!form.destination.trim()) {
      setError("Please enter a destination.");
      return;
    }

    if (!form.interests.trim()) {
      setError("Please enter your interests.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      setPlan(null);

      const result = await generateTravelPlan({
        destination: form.destination.trim(),
        days: Number(form.days),
        travelers: Number(form.travelers),
        budget: form.budget,
        interests: form.interests.trim(),
      });

      setPlan(result.data);
    } catch (err) {
      setError(err.message || "Failed to generate travel plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!plan) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await saveAIPlan({
        title: plan.title,
        destination: plan.destination || form.destination,
        days: Number(form.days),
        travelers: Number(form.travelers),
        budget: form.budget,
        interests: form.interests,
        summary: plan.summary,
        itinerary: plan.itinerary || plan.days || [],
        tips: plan.tips || [],
      });

      setSuccess("Travel plan saved successfully.");
    } catch (err) {
      setError(err.message || "Failed to save travel plan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="mx-auto max-w-6xl px-6 py-12">

        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
            VAZHO AI
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900">
            Plan your perfect trip
          </h1>

          <p className="mt-4 text-neutral-600">
            Tell VAZHO where you want to go and what you love.
            We will create a personalized travel itinerary for you.
          </p>
        </div>

        {/* Planner Form */}
        <form
          onSubmit={handleGenerate}
          className="mt-10 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Destination
              </label>

              <input
                type="text"
                name="destination"
                value={form.destination}
                onChange={handleChange}
                placeholder="e.g. Jaipur"
                className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Number of days
              </label>

              <input
                type="number"
                name="days"
                min="1"
                max="30"
                value={form.days}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Travelers
              </label>

              <input
                type="number"
                name="travelers"
                min="1"
                max="20"
                value={form.travelers}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700">
                Budget
              </label>

              <select
                name="budget"
                value={form.budget}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-700"
              >
                <option value="low">Budget</option>
                <option value="medium">Medium</option>
                <option value="high">Luxury</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700">
                Interests
              </label>

              <textarea
                name="interests"
                value={form.interests}
                onChange={handleChange}
                placeholder="e.g. forts, food, culture, shopping"
                rows={4}
                className="mt-2 w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-700"
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 rounded-xl bg-black px-6 py-3 font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating your plan..." : "Generate Travel Plan"}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-10 rounded-3xl border border-neutral-200 bg-white p-10 text-center">
            <p className="text-lg font-medium">
              VAZHO is creating your itinerary...
            </p>

            <p className="mt-2 text-sm text-neutral-500">
              This may take a few seconds.
            </p>
          </div>
        )}

        {/* Result */}
        {plan && !loading && (
          <div className="mt-10">

            {/* Overview */}
            <div className="rounded-3xl bg-black p-8 text-white">
              <p className="text-sm uppercase tracking-widest text-neutral-400">
                Your AI Travel Plan
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                {plan.title}
              </h2>

              <p className="mt-4 leading-7 text-neutral-300">
                {plan.summary}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
                  {plan.destination || form.destination}
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
                  {form.days} days
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
                  {form.travelers} travelers
                </span>

                <span className="rounded-full bg-white/10 px-4 py-2 text-sm capitalize">
                  {form.budget} budget
                </span>
              </div>
            </div>

            {/* Save */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl bg-black px-6 py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Travel Plan"}
              </button>
            </div>

            {/* Itinerary */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-neutral-900">
                Your Itinerary
              </h2>

              <div className="mt-6 space-y-6">
                {(plan.itinerary || plan.days || []).map((day, index) => (
                  <div
                    key={index}
                    className="relative rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-900 font-bold text-white">
                        {day.day || index + 1}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-neutral-900">
                          {day.title || `Day ${index + 1}`}
                        </h3>

                        {day.description && (
                          <p className="mt-2 leading-6 text-neutral-600">
                            {day.description}
                          </p>
                        )}

                        {Array.isArray(day.activities) &&
                          day.activities.length > 0 && (
                            <div className="mt-5">
                              <h4 className="font-semibold text-neutral-900">
                                Activities
                              </h4>

                              <ul className="mt-3 space-y-2">
                                {day.activities.map((activity, activityIndex) => (
                                  <li
                                    key={activityIndex}
                                    className="flex gap-3 text-neutral-600"
                                  >
                                    <span>•</span>
                                    <span>{activity}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            {Array.isArray(plan.tips) && plan.tips.length > 0 && (
              <div className="mt-10 rounded-3xl border border-neutral-200 bg-white p-6">
                <h2 className="text-2xl font-bold">
                  Travel Tips
                </h2>

                <ul className="mt-5 space-y-3">
                  {plan.tips.map((tip, index) => (
                    <li
                      key={index}
                      className="flex gap-3 text-neutral-600"
                    >
                      <span>✓</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default AIPlanner;