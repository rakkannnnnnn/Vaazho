import { travelStyleOptions } from "./plannerOptions";

function TravelStyleField({ value, onChange }) {
  return (
    <div>
      <div className="mb-3">
        <p className="text-sm font-semibold">
          Travel style
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {travelStyleOptions.map((style) => {
          const selected = value === style;

          return (
            <button
              key={style}
              type="button"
              onClick={() => onChange(style)}
              aria-pressed={selected}
              className={`rounded-xl border p-4 text-left transition ${
                selected
                  ? "border-neutral-950 bg-neutral-950 text-white"
                  : "border-neutral-200 bg-white hover:border-neutral-400"
              }`}
            >
              <p className="font-semibold">
                {style}
              </p>

              <p
                className={`mt-1 text-xs ${
                  selected
                    ? "text-white/70"
                    : "text-neutral-500"
                }`}
              >
                {style === "Budget" &&
                  "Keep costs as low as possible."}

                {style === "Balanced" &&
                  "Balance comfort and cost."}

                {style === "Luxury" &&
                  "Prioritize comfort and premium experiences."}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TravelStyleField;