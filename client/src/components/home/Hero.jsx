import SearchCard from "./SearchCard";

function Hero() {
  return (
    <section className="relative isolate min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Hero Image */}
      <img
        src="https://images.unsplash.com/photo-1500534623283-312aade485b7"
        alt="Beautiful travel destination"
        className="absolute inset-0 -z-20 h-full w-full scale-105 object-cover"
        />

      {/* Overlay */}
      <div className="absolute inset-0 -z-10 bg-black/45" />

      {/* Content */}
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="max-w-3xl text-white">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
              Travel differently
            </p>

            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Your journey
              <br />
              starts here.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
              Discover destinations, find unique stays, and create
              personalized journeys with VAZHO.
            </p>
          </div>

          <div className="mt-10">
            <SearchCard />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;