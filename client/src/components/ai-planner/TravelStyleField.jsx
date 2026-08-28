import { travelStyleOptions } from "./plannerOptions";

function TravelStyleField({ value, onChange }) {
  return (
    <div>
      <div className="mb-3">
        <p className="text-sm font-semibold text-neutral-900 dark:text-white">
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
                  ? "border-neutral-950 bg-neutral-950 text-white dark:border-neutral-300 dark:bg-neutral-700 dark:text-white"
                  : "border-neutral-200 bg-white text-neutral-900 hover:border-neutral-400 dark:border-neutral-700 dark:!bg-neutral-800 dark:!text-neutral-100 dark:hover:border-neutral-500"
              }`}
            >
              <p className="font-semibold">
                {style}
              </p>

              <p
                className={`mt-1 text-xs ${
                  selected
                    ? "text-white/70"
                    : "text-neutral-500 dark:text-neutral-400"
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