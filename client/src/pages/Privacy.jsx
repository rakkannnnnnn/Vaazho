import PageHeader from "../components/layout/PageHeader"

function Privacy() {
  return (
    <main>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="This page explains the general approach VAZHO takes toward user information and platform data."
      />

      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h2>Information we collect</h2>

            <p>
              VAZHO may collect information required to provide
              account, booking, travel planning and platform services.
            </p>

            <h2>How information is used</h2>

            <p>
              Information may be used to provide requested services,
              improve the platform, manage bookings and personalize
              travel experiences.
            </p>

            <h2>Data security</h2>

            <p>
              Sensitive credentials and service secrets should be
              securely stored on the server and must not be exposed
              through the frontend.
            </p>

            <h2>Third-party services</h2>

            <p>
              VAZHO may integrate services such as authentication,
              payments, maps, email and AI providers. Their respective
              policies may also apply when those services are used.
            </p>

            <h2>Contact</h2>

            <p>
              If you have questions about this policy, please contact
              the VAZHO team.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Privacy