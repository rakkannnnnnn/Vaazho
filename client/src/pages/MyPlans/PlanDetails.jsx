import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Users,
  CalendarDays,
  Wallet,
  Sparkles,
  Trash2,
  PencilLine,
  RefreshCw,
  Save,
} from "lucide-react";
import { api } from "@/lib/api";
import { generateTravelPlan, updateAIPlan } from "@/services/aiService";

function PlanDetails() {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [regeneratedPlan, setRegeneratedPlan] = useState(null);
  const [editForm, setEditForm] = useState({
    destination: "",
    days: 1,
    travelers: 1,
    budget: "medium",
    interests: "",
  });

  const buildEditForm = (planData) => ({
    destination: planData?.destination || "",
    days: Number(planData?.days) || 1,
    travelers: Number(planData?.travelers) || 1,
    budget: planData?.budget || "medium",
    interests: planData?.interests || "",
  });

  const loadPlan = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await api.getAIPlanById(planId);
      const nextPlan = response.plan || null;
      setPlan(nextPlan);
      setEditForm(buildEditForm(nextPlan));
      setRegeneratedPlan(null);
    } catch (err) {
      console.error("Plan details load error:", err);
      setError(err.message === "Travel plan not found." ? "Travel plan not found." : "Unable to load this saved travel plan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (planId) {
      loadPlan();
    }
  }, [planId]);

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    if (!planId) return;

    const destination = editForm.destination.trim();
    const interests = editForm.interests.trim();
    const days = Number(editForm.days);
    const travelers = Number(editForm.travelers);

    if (!destination) {
      setError("Destination is required.");
      return;
    }

    if (!Number.isInteger(days) || days < 1) {
      setError("Days must be a valid number greater than 0.");
      return;
    }

    if (!Number.isInteger(travelers) || travelers < 1) {
      setError("Travelers must be a valid number greater than 0.");
      return;
    }

    if (!interests) {
      setError("Interests are required.");
      return;
    }

    try {
      setUpdateLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await updateAIPlan(planId, {
        destination,
        days,
        travelers,
        budget: editForm.budget || "medium",
        interests,
      });

      const updatedPlan = response.plan || null;
      setPlan(updatedPlan);
      setEditForm(buildEditForm(updatedPlan));
      setIsEditing(false);
      setSuccessMessage(response.message || "Travel plan updated successfully.");
    } catch (err) {
      console.error("Update AI plan error:", err);
      setError(err.message || "Failed to update this travel plan.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!plan) return;

    try {
      setRegenLoading(true);
      setError("");
      setSuccessMessage("");

      const result = await generateTravelPlan({
        destination: plan.destination,
        days: Number(plan.days),
        travelers: Number(plan.travelers),
        budget: plan.budget,
        interests: plan.interests,
      });

      setRegeneratedPlan(result.data);
    } catch (err) {
      console.error("Regenerate AI plan error:", err);
      setError(err.message || "Unable to regenerate this travel plan.");
    } finally {
      setRegenLoading(false);
    }
  };

  const handleSaveRegeneratedPlan = async () => {
    if (!planId || !regeneratedPlan) return;

    try {
      setUpdateLoading(true);
      setError("");
      setSuccessMessage("");

      const response = await updateAIPlan(planId, {
        title: regeneratedPlan.title,
        destination: plan.destination,
        days: Number(plan.days),
        travelers: Number(plan.travelers),
        budget: plan.budget,
        interests: plan.interests,
        summary: regeneratedPlan.summary,
        itinerary: Array.isArray(regeneratedPlan.days) ? regeneratedPlan.days : [],
        tips: Array.isArray(regeneratedPlan.tips) ? regeneratedPlan.tips : [],
      });

      const updatedPlan = response.plan || null;
      setPlan(updatedPlan);
      setEditForm(buildEditForm(updatedPlan));
      setRegeneratedPlan(null);
      setSuccessMessage(response.message || "Travel plan updated successfully.");
    } catch (err) {
      console.error("Save regenerated AI plan error:", err);
      setError(err.message || "Failed to save the regenerated travel plan.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!planId) return;

    const confirmed = window.confirm("Delete this saved travel plan?");
    if (!confirmed) return;

    try {
      setDeleteLoading(true);
      await api.deleteAIPlan(planId);
      navigate("/my-plans", { replace: true });
    } catch (err) {
      console.error("Delete AI plan error:", err);
      setError(err.message || "Failed to delete this travel plan.");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-neutral-200 bg-white p-8 text-center text-neutral-600 shadow-sm">
          Loading travel plan...
        </div>
      </main>
    );
  }

  if (error || !plan) {
    return (
      <main className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-red-700">Travel plan not found.</h1>
          <p className="mt-3 text-sm text-red-600">{error || "Travel plan not found."}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/my-plans"
              className="inline-flex items-center rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 hover:border-neutral-400"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to My Plans
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const itinerary = Array.isArray(plan.itinerary) ? plan.itinerary : [];
  const tips = Array.isArray(plan.tips) ? plan.tips : [];

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/my-plans"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Plans
          </Link>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setEditForm(buildEditForm(plan));
                setError("");
                setSuccessMessage("");
              }}
              disabled={updateLoading || deleteLoading || regenLoading}
              className="inline-flex items-center justify-center rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-800 transition hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <PencilLine className="mr-2 h-4 w-4" />
              Edit Plan
            </button>

            <button
              type="button"
              onClick={handleRegenerate}
              disabled={updateLoading || deleteLoading || regenLoading}
              className="inline-flex items-center justify-center rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${regenLoading ? "animate-spin" : ""}`} />
              {regenLoading ? "Regenerating..." : "Regenerate with AI"}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={updateLoading || deleteLoading || regenLoading}
              className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deleteLoading ? "Deleting..." : "Delete Plan"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          {isEditing && (
            <form onSubmit={handleSaveEdit} className="mb-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold text-neutral-900">Edit travel plan</h2>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor="destination" className="block text-sm font-semibold text-neutral-800">
                    Destination
                  </label>
                  <input
                    id="destination"
                    name="destination"
                    type="text"
                    value={editForm.destination}
                    onChange={handleEditChange}
                    className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-neutral-800"
                  />
                </div>

                <div>
                  <label htmlFor="days" className="block text-sm font-semibold text-neutral-800">
                    Number of days
                  </label>
                  <input
                    id="days"
                    name="days"
                    type="number"
                    min="1"
                    value={editForm.days}
                    onChange={handleEditChange}
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
                    value={editForm.travelers}
                    onChange={handleEditChange}
                    className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-neutral-800"
                  />
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-semibold text-neutral-800">
                    Budget
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={editForm.budget}
                    onChange={handleEditChange}
                    className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-neutral-800"
                  >
                    <option value="low">Budget</option>
                    <option value="medium">Moderate</option>
                    <option value="high">Luxury</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="interests" className="block text-sm font-semibold text-neutral-800">
                    Interests
                  </label>
                  <textarea
                    id="interests"
                    name="interests"
                    rows={3}
                    value={editForm.interests}
                    onChange={handleEditChange}
                    className="mt-2 w-full resize-none rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none focus:border-neutral-800"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="inline-flex items-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {updateLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          <div className="flex flex-col gap-5 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                {plan.destination}
              </p>
              <h1 className="mt-2 text-3xl font-bold text-neutral-900 sm:text-4xl">
                {plan.title}
              </h1>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
              Saved plan
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-neutral-100 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                <MapPin className="h-4 w-4" />
                Destination
              </div>
              <div className="mt-2 text-base font-semibold text-neutral-900">{plan.destination}</div>
            </div>

            <div className="rounded-2xl bg-neutral-100 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                <CalendarDays className="h-4 w-4" />
                Days
              </div>
              <div className="mt-2 text-base font-semibold text-neutral-900">{plan.days}</div>
            </div>

            <div className="rounded-2xl bg-neutral-100 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                <Users className="h-4 w-4" />
                Travelers
              </div>
              <div className="mt-2 text-base font-semibold text-neutral-900">{plan.travelers}</div>
            </div>

            <div className="rounded-2xl bg-neutral-100 p-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
                <Wallet className="h-4 w-4" />
                Budget
              </div>
              <div className="mt-2 text-base font-semibold capitalize text-neutral-900">{plan.budget}</div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-neutral-100 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
              <Sparkles className="h-4 w-4" />
              Summary
            </div>
            <p className="mt-3 text-base leading-7 text-neutral-700">{plan.summary}</p>
          </div>

          <div className="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
            <h2 className="text-xl font-bold text-neutral-900">Trip details</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Trip title</p>
                <p className="mt-2 text-base font-semibold text-neutral-900">{plan.title}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Destination</p>
                <p className="mt-2 text-base font-semibold text-neutral-900">{plan.destination}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Days</p>
                <p className="mt-2 text-base font-semibold text-neutral-900">{plan.days}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Travelers</p>
                <p className="mt-2 text-base font-semibold text-neutral-900">{plan.travelers}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Budget</p>
                <p className="mt-2 text-base font-semibold capitalize text-neutral-900">{plan.budget}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">Interests</p>
                <p className="mt-2 text-base font-semibold text-neutral-900">{plan.interests || "Not specified"}</p>
              </div>
            </div>
          </div>

          {regeneratedPlan && (
            <div className="mt-8 rounded-2xl border border-violet-200 bg-violet-50 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
                    Regenerated itinerary preview
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-neutral-900">{regeneratedPlan.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={handleSaveRegeneratedPlan}
                  disabled={updateLoading}
                  className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {updateLoading ? "Updating..." : "Save Updated Plan"}
                </button>
              </div>

              <p className="mt-4 text-sm leading-7 text-violet-900">{regeneratedPlan.summary}</p>

              <div className="mt-5 space-y-4">
                {(Array.isArray(regeneratedPlan.days) ? regeneratedPlan.days : []).map((day, index) => (
                  <div key={`${day.title}-${index}`} className="rounded-2xl border border-violet-200 bg-white p-4">
                    <h3 className="text-lg font-semibold text-neutral-900">{day.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">{day.description}</p>
                    {Array.isArray(day.activities) && day.activities.length > 0 && (
                      <ul className="mt-3 space-y-2 text-sm text-neutral-700">
                        {day.activities.map((activity, itemIndex) => (
                          <li key={`${activity}-${itemIndex}`} className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-violet-700" />
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-bold text-neutral-900">Full itinerary</h2>
            <div className="mt-5 space-y-4">
              {itinerary.length > 0 ? (
                itinerary.map((day, index) => (
                  <div key={`${day.title}-${index}`} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {day.title || `Day ${Number(day.day) || index + 1}`}
                    </h3>
                    <p className="mt-2 text-sm font-medium text-neutral-500">
                      {day.day ? `Day ${day.day}` : `Day ${index + 1}`}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">{day.description}</p>

                    {Array.isArray(day.activities) && day.activities.length > 0 && (
                      <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                        {day.activities.map((activity, itemIndex) => (
                          <li key={`${activity}-${itemIndex}`} className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-neutral-800" />
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-neutral-300 p-5 text-neutral-600">
                  No itinerary details were saved for this plan.
                </div>
              )}
            </div>
          </div>

          {tips.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-neutral-900">Travel Tips</h2>
              <ul className="mt-4 space-y-3">
                {tips.map((tip, index) => (
                  <li key={`${tip}-${index}`} className="flex items-start gap-3 rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700">
                    <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 border-t border-neutral-200 pt-5 text-sm text-neutral-500">
            Created: {new Date(plan.createdAt).toLocaleDateString()} • Interests: {plan.interests || "Not specified"}
          </div>
        </div>
      </div>
    </main>
  );
}

export default PlanDetails;
