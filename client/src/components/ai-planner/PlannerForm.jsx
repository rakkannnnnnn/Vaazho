import { Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import BudgetField from "./BudgetField";
import TravelersField from "./TravelersField";
import DurationField from "./DurationField";
import InterestsField from "./InterestsField";
import FoodPreferenceField from "./FoodPreferenceField";
import TravelStyleField from "./TravelStyleField";
import PlannerSummary from "./PlannerSummary";

function PlannerForm() {
  const [budget, setBudget] = useState("");
  const [travelers, setTravelers] = useState("");
  const [duration, setDuration] = useState("");
  const [interests, setInterests] = useState([]);
  const [food, setFood] = useState("");
  const [travelStyle, setTravelStyle] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (!budget) {
      setError("Please enter your budget.");
      return;
    }

    if (!travelers) {
      setError("Please enter the number of travelers.");
      return;
    }

    if (!duration) {
      setError("Please enter your trip duration.");
      return;
    }

    if (interests.length === 0) {
      setError("Please select at least one interest.");
      return;
    }

    if (!food) {
      setError("Please select a food preference.");
      return;
    }

    if (!travelStyle) {
      setError("Please select your travel style.");
      return;
    }

    const plannerData = {
      budget: Number(budget),
      travelers: Number(travelers),
      duration: Number(duration),
      interests,
      food,
      travelStyle,
    };

    console.log("VAZHO AI Planner Input:", plannerData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <BudgetField
          value={budget}
          onChange={setBudget}
        />

        <TravelersField
          value={travelers}
          onChange={setTravelers}
        />

        <DurationField
          value={duration}
          onChange={setDuration}
        />
      </div>

      <InterestsField
        value={interests}
        onChange={setInterests}
      />

      <FoodPreferenceField
        value={food}
        onChange={setFood}
      />

      <TravelStyleField
        value={travelStyle}
        onChange={setTravelStyle}
      />

      <PlannerSummary
        budget={budget}
        travelers={travelers}
        duration={duration}
        interests={interests}
        food={food}
        travelStyle={travelStyle}
      />

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
        >
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="h-14 w-full rounded-xl text-base"
      >
        <Sparkles />
        Generate My Plan
      </Button>
    </form>
  );
}

export default PlannerForm;