import { ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"

function DestinationCard({ destination }) {
  return (
    <Link
      to={`/destinations/${destination.slug}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={destination.image}
          alt={`${destination.name} destination`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />

        {/* Destination name on image */}
        <div className="absolute bottom-4 left-4">
          <h3 className="text-xl font-semibold text-white">
            {destination.name}
          </h3>
        </div>

        {/* Arrow */}
        <div className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/90 text-black shadow-sm transition-transform duration-300 group-hover:rotate-45">
          <ArrowUpRight className="size-5" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {destination.description}
        </p>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">
              Starting from
            </p>

            <p className="mt-1 font-semibold">
              ₹{destination.startingPrice.toLocaleString("en-IN")}
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                / night
              </span>
            </p>
          </div>

          <span className="text-sm font-medium text-primary">
            Explore
          </span>
        </div>
      </div>
    </Link>
  )
}

export default DestinationCard