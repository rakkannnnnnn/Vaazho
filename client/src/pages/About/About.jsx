const features = [
  {
    title: "Destination discovery",
    description: "Explore places that match the kind of journey you want to take.",
  },
  {
    title: "Stay discovery",
    description: "Find accommodation options suited to your plans and preferences.",
  },
  {
    title: "Customized experiences",
    description: "Shape each trip around your pace, interests, and travel style.",
  },
  {
    title: "AI trip planning",
    description: "Use guided planning tools to turn your ideas into a clearer itinerary.",
  },
  {
    title: "Budget planning",
    description: "Keep your plans grounded with a practical view of your trip budget.",
  },
  {
    title: "Personalized itineraries",
    description: "Bring destinations, stays, and activities together in one journey.",
  },
];

function About() {
  return (
    <main className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-white">
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
            About VAZHO
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
            Travel planning, made simpler.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-400">
            VAZHO brings destination discovery, accommodation, booking,
            customization, and AI-powered travel planning together in one
            thoughtful platform.
          </p>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/60">
        <div className="mx-auto grid max-w-5xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              What is VAZHO?
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">One place for the journey ahead.</h2>
          </div>
          <p className="text-base leading-7 text-neutral-600 dark:text-neutral-400">
            VAZHO is a travel platform designed to help travelers discover
            destinations, find suitable stays, customize their experience, and
            plan trips using AI. It keeps the early, often scattered parts of
            travel planning connected and easier to explore.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            What we offer
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">Tools for a more considered trip.</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
            >
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-neutral-950 text-white dark:bg-neutral-900">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-neutral-400">Our vision</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Make the route from idea to itinerary feel natural.
          </h2>
          <p className="mt-5 max-w-2xl leading-7 text-neutral-300">
            Our goal is to make travel planning easier, more personalized, and
            accessible, so more of the process feels useful and less of it
            feels like work.
          </p>
        </div>
      </section>
    </main>
  );
}

export default About;
