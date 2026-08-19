import PageHeader from "../components/layout/PageHeader"

function Terms() {
  return (
    <main>
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        description="These terms describe the general rules for using the VAZHO platform."
      />

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h2>Using VAZHO</h2>

            <p>
              Users should provide accurate information when using
              VAZHO services and should use the platform responsibly.
            </p>

            <h2>Bookings</h2>

            <p>
              Booking availability, pricing and final booking totals
              are determined by the platform backend and applicable
              property information.
            </p>

            <h2>Payments</h2>

            <p>
              Payment processing may be handled through supported
              third-party payment services. Payment verification must
              be performed by the server.
            </p>

            <h2>AI-generated information</h2>

            <p>
              AI recommendations are intended to assist travel
              planning. AI-generated estimates should not be treated
              as guaranteed availability, pricing or booking
              confirmation.
            </p>

            <h2>Platform changes</h2>

            <p>
              Features and services may be changed, improved or
              temporarily unavailable as the VAZHO platform develops.
            </p>

            <h2>Contact</h2>

            <p>
              Questions about these terms can be directed to the VAZHO
              team through the Contact page.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Terms