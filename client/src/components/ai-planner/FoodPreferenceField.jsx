import { foodOptions } from "./plannerOptions";

function FoodPreferenceField({ value, onChange }) {
  return (
    <div>
      <div className="mb-3">
        <p className="text-sm font-semibold">
          Food preference
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {foodOptions.map((option) => {
          const selected = value === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              aria-pressed={selected}
              className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                selected
                  ? "border-neutral-950 bg-neutral-950 text-white"
                  : "border-neutral-200 bg-white hover:border-neutral-400"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FoodPreferenceField;