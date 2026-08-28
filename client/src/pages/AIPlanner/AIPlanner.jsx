import PlannerForm from "@/components/ai-planner/PlannerForm";
import PlannerHeader from "@/components/ai-planner/PlannerHeader";

function AIPlanner() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <PlannerHeader />

        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <PlannerForm />
        </div>
      </section>
    </main>
  );
}

export default AIPlanner;