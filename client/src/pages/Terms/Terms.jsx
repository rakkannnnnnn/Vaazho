const sections = [
  ["Introduction", "These Terms & Conditions describe the general expectations for using VAZHO, a student project and demonstration travel platform."],
  ["Use of the platform", "You may use VAZHO to explore destinations, review available stay information, and experiment with travel planning features for personal, non-commercial purposes."],
  ["User accounts", "Some future features may require an account. You are responsible for providing accurate information and keeping any account details secure."],
  ["Bookings and payments", "Booking and payment features shown in the project are subject to the terms of the relevant travel or payment provider. VAZHO does not currently represent a completed payment service."],
  ["Cancellations", "Cancellation rules can vary by stay or provider. Review the applicable provider terms before relying on a booking or itinerary."],
  ["AI-generated recommendations", "AI planner suggestions are for planning assistance only. Check destinations, prices, availability, travel requirements, and safety information independently before making decisions."],
  ["User responsibilities", "Use the platform respectfully, provide truthful information, and do not attempt to disrupt, misuse, or gain unauthorized access to the service."],
  ["Limitation of liability", "As a project demonstration, VAZHO is provided without a guarantee that every feature, recommendation, price, or availability detail will be accurate or continuously available."],
  ["Changes to terms", "These terms may be updated as the project develops. The latest version will be posted on this page."],
  ["Contact", "Questions about these terms can be sent through the Contact page. These terms have not been legally reviewed or certified."],
];

function Terms() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-white">
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">VAZHO</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Terms &amp; Conditions</h1>
        <p className="mt-5 max-w-2xl leading-7 text-neutral-600 dark:text-neutral-400">General terms for this project and demonstration platform. Please treat this page as informational rather than legal advice.</p>
        <div className="mt-12 space-y-10">
          {sections.map(([title, content]) => (
            <section key={title}>
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-400">{content}</p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Terms;
