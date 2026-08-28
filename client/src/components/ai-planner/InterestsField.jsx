import { interestOptions } from "./plannerOptions";

function InterestsField({ value, onChange }) {
  const toggleInterest = (interest) => {
    if (value.includes(interest)) {
      onChange(value.filter((item) => item !== interest));
      return;
    }

    onChange([...value, interest]);
  };

  return (
    <div>
      <div className="mb-3">
        <p className="text-sm font-semibold text-neutral-900 dark:text-white">
          What are you interested in?
        </p>

        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          Select as many as you like.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {interestOptions.map((interest) => {
          const selected = value.includes(interest);

          return (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              aria-pressed={selected}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                selected
                  ? "border-neutral-950 bg-neutral-950 text-white dark:border-neutral-300 dark:bg-neutral-700 dark:text-white"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 dark:border-neutral-700 dark:!bg-neutral-800 dark:!text-neutral-200 dark:hover:border-neutral-500"
              }`}
            >
              {interest}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default InterestsField;