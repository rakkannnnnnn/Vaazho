import Hero from "@/components/home/Hero";

function Home() {
  return (
    <div>
      <Hero />

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
            Explore with VAZHO
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Travel planning, made simpler.
          </h2>

          <p className="mt-4 text-neutral-600">
            Find stays, explore destinations, and build personalized
            travel experiences from one place.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;