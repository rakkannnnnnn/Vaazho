import { useEffect, useState } from "react";
import { api } from "@/lib/api";

function MyPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await api.getMyAIPlans();
        setPlans(Array.isArray(data.plans) ? data.plans : []);
      } catch (err) {
        console.error("My plans fetch error:", err);
        setError(err.message || "Failed to load your saved travel plans.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500">
            VAZHO
          </p>
          <h1 className="mt-3 text-3xl font-bold text-neutral-900 sm:text-4xl">
            My Travel Plans
          </h1>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-neutral-600">
            Loading your plans...
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-neutral-300 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-neutral-800">You haven't saved any travel plans yet.</h2>
            <p className="mt-3 text-neutral-600">
              Generate a trip in the AI planner and save it here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan) => (
              <div key={plan._id} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                      {plan.destination}
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-neutral-900">{plan.title}</h2>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-neutral-600">{plan.summary}</p>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-neutral-600">
                  <div className="rounded-xl bg-neutral-100 p-3">
                    <div className="text-xs uppercase tracking-wide text-neutral-500">Days</div>
                    <div className="mt-1 font-semibold text-neutral-900">{plan.days}</div>
                  </div>
                  <div className="rounded-xl bg-neutral-100 p-3">
                    <div className="text-xs uppercase tracking-wide text-neutral-500">Travelers</div>
                    <div className="mt-1 font-semibold text-neutral-900">{plan.travelers}</div>
                  </div>
                  <div className="rounded-xl bg-neutral-100 p-3 col-span-2">
                    <div className="text-xs uppercase tracking-wide text-neutral-500">Budget</div>
                    <div className="mt-1 font-semibold text-neutral-900">{plan.budget}</div>
                  </div>
                </div>

                <div className="mt-5 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
                  Created: {new Date(plan.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyPlans;
