function PageHeader({ eyebrow, title, description }) {
  return (
    <section className="border-b border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              {eyebrow}
            </p>
          )}

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>

          {description && (
            <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default PageHeader