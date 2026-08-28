import { foodOptions } from "./plannerOptions";

function FoodPreferenceField({ value, onChange }) {
  return (
    <div>
      <div className="mb-3">
        <p className="text-sm font-semibold text-neutral-900 dark:text-white">
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
                  ? "border-neutral-950 bg-neutral-950 text-white dark:border-neutral-300 dark:bg-neutral-700 dark:text-white"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 dark:border-neutral-700 dark:!bg-neutral-800 dark:!text-neutral-200 dark:hover:border-neutral-500"
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