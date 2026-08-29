import { BedDouble, Check, Compass, Flame, Loader2, Sparkles, Utensils } from "lucide-react";
import React from "react";

const TYPE_ICONS = {
  food: Utensils,
  campfire: Flame,
  decoration: Sparkles,
  "extra-bed": BedDouble,
  activity: Compass,
};

export function getCustomizationUnitPriceLabel(customization) {
  const { price, pricingType } = customization;
  switch (pricingType) {
    case "per-night":
      return `₹${price} / night`;
    case "per-person":
      return `₹${price} / person`;
    case "per-booking":
    default:
      return `₹${price} / stay`;
  }
}

export function calculateItemAmount(customization, numberOfNights, guests) {
  const price = Number(customization.price || 0);
  switch (customization.pricingType) {
    case "per-night":
      return price * Math.max(1, numberOfNights);
    case "per-person":
      return price * Math.max(1, guests);
    case "per-booking":
    default:
      return price * 1;
  }
}

function CustomizationSelector({
  customizations = [],
  selectedIds = [],
  onToggleCustomization,
  loading = false,
  error = "",
  numberOfNights = 1,
  guests = 1,
}) {
  if (loading) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6 text-center dark:border-neutral-800 dark:bg-neutral-900/50">
        <Loader2 className="mx-auto h-6 w-6 animate-spin text-neutral-500" />
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          Loading travel customizations...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
        {error}
      </div>
    );
  }

  if (!customizations || customizations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 p-4 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
        No additional customizations available for this stay.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
          Customize Your Stay
        </label>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">
          Optional add-ons
        </span>
      </div>

      <div className="space-y-2.5">
        {customizations.map((item) => {
          const isSelected = selectedIds.includes(item._id);
          const Icon = TYPE_ICONS[item.type] || Sparkles;
          const calculatedSubtotal = calculateItemAmount(item, numberOfNights, guests);

          return (
            <div
              key={item._id}
              onClick={() => onToggleCustomization(item._id)}
              className={`group flex cursor-pointer items-start justify-between gap-3 rounded-xl border p-3.5 transition-all select-none ${
                isSelected
                  ? "border-neutral-900 bg-neutral-900 text-white shadow-sm dark:border-white dark:bg-white dark:text-neutral-950"
                  : "border-neutral-200 bg-white hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:bg-neutral-850"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Custom Checkbox */}
                <div
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                    isSelected
                      ? "border-transparent bg-white text-neutral-900 dark:bg-neutral-950 dark:text-white"
                      : "border-neutral-300 bg-white group-hover:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-800"
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 shrink-0 ${isSelected ? "text-amber-300 dark:text-amber-600" : "text-neutral-500 dark:text-neutral-400"}`} />
                    <span className="text-sm font-semibold leading-none">
                      {item.name}
                    </span>
                  </div>

                  <p
                    className={`mt-1 text-xs line-clamp-2 ${
                      isSelected
                        ? "text-neutral-300 dark:text-neutral-600"
                        : "text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Price & Calculation */}
              <div className="text-right shrink-0">
                <span className="text-sm font-bold block">
                  ₹{item.price}
                </span>
                <span
                  className={`text-[11px] block ${
                    isSelected
                      ? "text-neutral-300 dark:text-neutral-600"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {item.pricingType === "per-night"
                    ? "per night"
                    : item.pricingType === "per-person"
                    ? "per person"
                    : "per stay"}
                </span>

                {isSelected && (
                  <span
                    className={`mt-1 inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                      isSelected
                        ? "bg-white/20 text-white dark:bg-neutral-950/10 dark:text-neutral-950"
                        : ""
                    }`}
                  >
                    +₹{calculatedSubtotal}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CustomizationSelector;
