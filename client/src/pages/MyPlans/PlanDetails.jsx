import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Users, CalendarDays, Wallet, Sparkles, Trash2 } from "lucide-react";
import { api } from "@/lib/api";

function PlanDetails() {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadPlan = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.getAIPlanById(planId);
      setPlan(response.plan || null);
    } catch (err) {
      console.error("Plan details load error:", err);
      setError(err.message || "Unable to load this saved travel plan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (planId) {
      loadPlan();
    }
  }, [planId]);

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
          <h1 className="text-2xl font-bold text-red-700">Travel Plan Not Available</h1>
          <p className="mt-3 text-sm text-red-600">{error || "This plan could not be found."}</p>
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

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteLoading}
            className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleteLoading ? "Deleting..." : "Delete Plan"}
          </button>
        </div>

        <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
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

          <div className="mt-8">
            <h2 className="text-xl font-bold text-neutral-900">Itinerary</h2>
            <div className="mt-5 space-y-4">
              {itinerary.length > 0 ? (
                itinerary.map((day, index) => (
                  <div key={`${day.title}-${index}`} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                    <h3 className="text-lg font-semibold text-neutral-900">{day.title}</h3>
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
              <h2 className="text-xl font-bold text-neutral-900">Helpful Tips</h2>
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
