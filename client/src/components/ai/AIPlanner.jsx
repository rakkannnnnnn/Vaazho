import { useState } from "react";
import { api } from "@/lib/api";
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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleGeneratePlan = async (event) => {
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
      setSaveMessage("");
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
      setError(err.message || "Unable to generate your travel plan.");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!plan) return;

    try {
      setSaving(true);
      setError("");
      setSaveMessage("");

      const payload = {
        title: plan.title,
        destination: plan.destination || formData.destination,
        days: Number(plan.days ?? formData.days),
        travelers: Number(plan.travelers ?? formData.travelers),
        budget: plan.budget || formData.budget,
        interests: formData.interests,
        summary: plan.summary,
        itinerary: Array.isArray(plan.itinerary) ? plan.itinerary : [],
        tips: Array.isArray(plan.tips) ? plan.tips : [],
      };

      const response = await api.saveAIPlan(payload);

      setSaveMessage(response.message || "Travel plan saved successfully.");
    } catch (err) {
      console.error("Save AI plan error:", err);
      setError(err.message || "Failed to save travel plan.");
    } finally {
      setSaving(false);
    }
  };

  const handleNewPlan = () => {
    setPlan(null);
    setError("");
    setSaveMessage("");
  };

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 text-neutral-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500">
            VAZHO AI
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Plan your perfect trip
          </h1>
          <p className="mt-4 text-lg text-neutral-600">
            Tell VAZHO where you want to go and what you love. We&apos;ll create a personalized travel plan for you.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-8">
          <form onSubmit={handleGeneratePlan} className="space-y-6">
            <div>
              <label htmlFor="destination" className="block text-sm font-semibold text-neutral-800">
                Destination
              </label>
              <input
                id="destination"
                name="destination"
                type="text"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Example: Jaipur"
                className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-neutral-800"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="days" className="block text-sm font-semibold text-neutral-800">
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
                  className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-neutral-800"
                />
              </div>

              <div>
                <label htmlFor="travelers" className="block text-sm font-semibold text-neutral-800">
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
                  className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-neutral-800"
                />
              </div>
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-semibold text-neutral-800">
                Budget
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-neutral-800"
              >
                <option value="low">Budget</option>
                <option value="medium">Moderate</option>
                <option value="high">Luxury</option>
              </select>
            </div>

            <div>
              <label htmlFor="interests" className="block text-sm font-semibold text-neutral-800">
                Interests
              </label>
              <textarea
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="Example: forts, food, shopping, culture, photography"
                rows={4}
                className="mt-2 w-full resize-none rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-neutral-800"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-black px-6 py-4 font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating your travel plan..." : "Generate Travel Plan"}
              </button>

              {plan && (
                <button
                  type="button"
                  onClick={handleNewPlan}
                  className="rounded-xl border border-neutral-300 bg-white px-6 py-4 font-semibold text-neutral-800 transition hover:border-neutral-400"
                >
                  Generate New Plan
                </button>
              )}
            </div>
          </form>
        </div>

        {plan && (
          <div className="mx-auto mt-12 max-w-5xl rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Your itinerary
                </p>
                <h2 className="mt-2 text-3xl font-bold text-neutral-900">
                  {plan.title || `${plan.destination || formData.destination} Travel Plan`}
                </h2>
              </div>

              <button
                type="button"
                onClick={handleSavePlan}
                disabled={saving}
                className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Travel Plan"}
              </button>
            </div>

            {saveMessage && (
              <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                {saveMessage}
              </div>
            )}

            <div className="mb-8 grid gap-4 rounded-2xl bg-neutral-100 p-5 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Destination</p>
                <p className="mt-2 text-base font-semibold text-neutral-900">{plan.destination || formData.destination}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Days</p>
                <p className="mt-2 text-base font-semibold text-neutral-900">{plan.days || formData.days}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Travelers</p>
                <p className="mt-2 text-base font-semibold text-neutral-900">{plan.travelers || formData.travelers}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Budget</p>
                <p className="mt-2 text-base font-semibold capitalize text-neutral-900">{plan.budget || formData.budget}</p>
              </div>
            </div>

            {plan.summary && (
              <div className="mb-8 rounded-2xl bg-neutral-100 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Summary
                </p>
                <p className="mt-3 text-base leading-7 text-neutral-700">{plan.summary}</p>
              </div>
            )}

            {Array.isArray(plan.itinerary) && plan.itinerary.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-xl font-bold text-neutral-900">Day-by-day itinerary</h3>
                <div className="space-y-5">
                  {plan.itinerary.map((day, index) => (
                    <div key={`${day.title || "day"}-${index}`} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                      <h4 className="text-lg font-bold text-neutral-900">
                        {day.title || `Day ${Number(day.day) || index + 1}`}
                      </h4>
                      <p className="mt-2 text-sm font-medium text-neutral-500">
                        {day.day ? `Day ${day.day}` : `Day ${index + 1}`}
                      </p>
                      {day.description && (
                        <p className="mt-2 text-sm leading-6 text-neutral-600">{day.description}</p>
                      )}

                      {Array.isArray(day.activities) && day.activities.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {day.activities.map((activity, activityIndex) => (
                            <li key={`${activity || "activity"}-${activityIndex}`} className="flex items-start gap-3 text-sm text-neutral-700">
                              <span className="mt-1 text-base text-neutral-500">•</span>
                              <span>{typeof activity === "string" ? activity : activity.name || activity.title || JSON.stringify(activity)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Array.isArray(plan.tips) && plan.tips.length > 0 && (
              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <h3 className="text-xl font-bold text-neutral-900">Travel Tips</h3>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-neutral-700">
                  {plan.tips.map((tip, index) => (
                    <li key={`${tip}-${index}`}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default AIPlanner;