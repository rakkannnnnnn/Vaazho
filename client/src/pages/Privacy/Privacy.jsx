const sections = [
  ["Information we collect", "The project may collect information that you choose to enter into forms, such as contact details or trip preferences."],
  ["How information is used", "Information may be used to display requested features, support local form interactions, and improve the project experience."],
  ["Authentication information", "If authentication is introduced, account information will be handled according to the provider and implementation used at that time."],
  ["Booking information", "Booking details may be needed to display or manage a booking workflow. Only provide information through the relevant supported feature."],
  ["Payment information", "Payment processing is not currently implemented in this demonstration. If Razorpay is introduced, payment processing is intended to be handled by Razorpay rather than stored by VAZHO."],
  ["AI planner information", "Trip preferences entered into the AI Planner may be used locally to generate and display a planning summary. Avoid entering sensitive personal information."],
  ["Cookies and local storage", "VAZHO may use browser local storage for preferences such as the selected light or dark theme. Your browser controls whether this storage is available."],
  ["Data security", "Reasonable care is taken within the project, but no demonstration application can promise that information is completely secure or always available."],
  ["Third-party services", "The project may use services such as image hosting or future payment and authentication providers. Their own privacy policies may also apply."],
  ["User rights", "You may clear local browser storage and choose not to submit information through the available forms. Contact us with questions about information you have provided."],
  ["Changes to this policy", "This policy may be updated as VAZHO develops. Changes will be reflected on this page."],
  ["Contact", "For privacy questions, use the Contact page to reach the project team."],
];

function Privacy() {
  return (
    <main className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-white">
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">VAZHO</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Privacy Policy</h1>
        <p className="mt-5 max-w-2xl leading-7 text-neutral-600 dark:text-neutral-400">This project policy explains the intended handling of information in the current VAZHO demonstration. It is not a claim of legal compliance.</p>
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

export default Privacy;
