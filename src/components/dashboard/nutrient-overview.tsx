"use client";

import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { ALL_NUTRIENTS_DICT } from "@/constants/constants";
import AddLogForm from "../add-log-form";

type FoodLog = {
  id: string;
  ingredient: Ingredient | null;
  recipe: Recipe | null;
  quantity: number;
  unit: string;
  logged_at: string;
  nutrients: Array<{
    nutrient_key: string;
    amount: number;
    unit: string;
  }>;
};

type Goal = {
  id: string;
  nutrient_key: string;
  target_amount: number;
  created_at: string;
};

const colorClasses = {
  blue: "text-[#3A8F9E] dark:text-[#C9E6EA]",
  green: "text-green-600 dark:text-green-400",
  amber: "text-amber-600 dark:text-amber-400",
  red: "text-red-600 dark:text-red-400",
  zinc: "text-zinc-600 dark:text-zinc-400",
};

type NutrientCardProps = {
  title: string;
  value: string;
  subtitle: string;
  color: keyof typeof colorClasses;
  compact?: boolean;
};

type Ingredient = { id: string; name: string; brand: string | null };
type Recipe = { id: string; name: string };

function NutrientCard({
  title,
  value,
  subtitle,
  color,
}: NutrientCardProps) {

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-4">
      <div className={`text-2xl font-bold ${colorClasses[color]}`}>{value}</div>
      <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 mt-1">
        {title}
      </div>
      <div className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
        {subtitle}
      </div>
    </div>
  );
}

// Skeleton loading component
function NutrientCardSkeleton({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-3 animate-pulse">
        <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-16 mb-2"></div>
        <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-full mb-2"></div>
        <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-4 animate-pulse">
      <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-20 mb-2"></div>
      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-full mb-2"></div>
      <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4"></div>
    </div>
  );
}

const NutrientOverview = forwardRef(
  ({ onLogSuccess }: { onLogSuccess?: () => void }, ref) => {
    const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
    const [goals, setGoals] = useState<Goal[]>([]);
    const [activeTab, setActiveTab] = useState("main");
    // const [selectedDate, setSelectedDate] = useState(
    //   new Date().toISOString().split("T")[0]
    // );
    const selectedDate = new Date().toISOString().split("T")[0];
    const [isLoading, setIsLoading] = useState(true);

    const fetchFoodLogs = async (date: string) => {
      const res = await fetch(`/api/food-logs?date=${date}`);
      const data = await res.json();
      if (data.success) setFoodLogs(data.food_logs || []);
    };

    const fetchGoals = async () => {
      try {
        const res = await fetch("/api/goals");
        const data = await res.json();
        if (data.success) setGoals(data.goals);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    const refresh = async () => {
      setIsLoading(true);
      const today = new Date().toISOString().split("T")[0];
      await Promise.all([fetchFoodLogs(today), fetchGoals()]);
      setIsLoading(false);
    };

    useImperativeHandle(ref, () => ({
      refresh,
    }));

    useEffect(() => {
      const loadInitialData = async () => {
        setIsLoading(true);
        const today = new Date().toISOString().split("T")[0];
        await Promise.all([fetchFoodLogs(today), fetchGoals()]);
        setIsLoading(false);
      };

      loadInitialData();
    }, []);

    const getTotalNutrients = () => {
      const totals: { [key: string]: { amount: number; unit: string } } = {};

      foodLogs.forEach((log) => {
        log.nutrients?.forEach((nutrient) => {
          if (!totals[nutrient.nutrient_key]) {
            totals[nutrient.nutrient_key] = { amount: 0, unit: nutrient.unit };
          }
          totals[nutrient.nutrient_key].amount += nutrient.amount;
        });
      });

      return totals;
    };

    const combineGoalsAndTotals = () => {
      const totals = getTotalNutrients();
      const mergedKeys = new Set([
        ...Object.keys(totals),
        ...goals.map((g) => g.nutrient_key),
      ]);

      return Array.from(mergedKeys).map((key) => {
        const goal = goals.find((g) => g.nutrient_key === key);
        const consumed = totals[key]?.amount || 0;
        const unit = totals[key]?.unit || "g";
        const target = goal?.target_amount || null;
        const percent = target
          ? Math.min((consumed / target) * 100, 100)
          : null;

        return {
          nutrient_key: key,
          consumed,
          unit,
          target,
          percent,
          hasGoal: !!goal,
        };
      });
    };

    const nutrientData = combineGoalsAndTotals();

    // Categorize nutrients
    const categorizedNutrients = {
      main: nutrientData.filter((n) =>
        ["calories", "protein", "total_fat", "total_carbs"].includes(
          n.nutrient_key
        )
      ),
      macros: nutrientData.filter((n) =>
        [
          "saturated_fat",
          "trans_fat",
          "dietary_fiber",
          "sugars",
          "added_sugars",
        ].includes(n.nutrient_key)
      ),
      vitamins: nutrientData.filter(
        (n) =>
          n.nutrient_key.includes("vitamin") ||
          [
            "thiamin",
            "riboflavin",
            "niacin",
            "folate",
            "biotin",
            "pantothenic_acid",
          ].includes(n.nutrient_key)
      ),
      minerals: nutrientData.filter((n) =>
        [
          "cholesterol",
          "sodium",
          "potassium",
          "calcium",
          "iron",
          "magnesium",
          "zinc",
        ].includes(n.nutrient_key)
      ),
      other: nutrientData.filter(
        (n) =>
          ![
            "calories",
            "protein",
            "total_fat",
            "total_carbs",
            "saturated_fat",
            "trans_fat",
            "dietary_fiber",
            "sugars",
            "added_sugars",
          ].includes(n.nutrient_key) &&
          !n.nutrient_key.includes("vitamin") &&
          ![
            "thiamin",
            "riboflavin",
            "niacin",
            "folate",
            "biotin",
            "pantothenic_acid",
            "cholesterol",
            "sodium",
            "potassium",
            "calcium",
            "iron",
            "magnesium",
            "zinc",
          ].includes(n.nutrient_key)
      ),
    };

    const getColor = (percent: number | null, hasGoal: boolean) => {
      if (!hasGoal) return "blue";
      if (!percent) return "zinc";
      if (percent >= 90) return "green";
      if (percent >= 70) return "amber";
      return "red";
    };

    // Check if there are no food logs
    const hasNoFoodLogs = foodLogs.length === 0;

    // Check if there are no nutrients to display
    const hasNoNutrients = nutrientData.length === 0;

    const handleLogSuccess = () => {
      refresh();
      onLogSuccess?.();
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">
            Nutrients
          </h3>

          {isLoading ? (
            <div className="space-y-4">
              <div className="flex space-x-4 border-b border-zinc-200 dark:border-zinc-700 pb-2">
                <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-20 animate-pulse"></div>
                <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-20 animate-pulse"></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <NutrientCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : hasNoFoodLogs ? (
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-10">
              <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2 text-center">
                No food logged today
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 mb-4 text-center">
                Log food to see your daily nutrients
              </p>
              <div className="flex items-center justify-center">
                <AddLogForm
                  selectedDate={selectedDate}
                  onLogSuccess={handleLogSuccess}
                />
              </div>
            </div>
          ) : hasNoNutrients ? (
            <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-4 text-center">
              <div className="text-zinc-400 dark:text-zinc-500 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
                No nutrient data available
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                The logged food items don&apos;t contain nutrient information
              </p>
            </div>
          ) : (
            <>
              <div className="border-b border-zinc-200 dark:border-zinc-700 mb-4">
                <nav className="flex space-x-4">
                  {Object.entries(categorizedNutrients)
                    .filter(([, nutrients]) => nutrients.length > 0)
                    .map(([category]) => (
                      <button
                        key={category}
                        onClick={() => setActiveTab(category)}
                        className={`px-3 py-2 text-sm font-medium rounded-t ${
                          activeTab === category
                            ? "text-[#3A8F9E] dark:text-[#C9E6EA] border-b-2 border-[#3A8F9E] dark:border-[#C9E6EA]"
                            : "text-zinc-400 hover:text-[#3A8F9E] dark:hover:text-[#C9E6EA] border-b-2 border-transparent hover:border-[#3A8F9E] dark:hover:border-[#C9E6EA] cursor-pointer"
                        }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                </nav>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categorizedNutrients[
                  activeTab as keyof typeof categorizedNutrients
                ].map((nutrient) => (
                  <NutrientCard
                    key={nutrient.nutrient_key}
                    title={
                      ALL_NUTRIENTS_DICT[nutrient.nutrient_key]?.display_name ||
                      nutrient.nutrient_key
                    }
                    value={`${nutrient.consumed.toFixed(0)}${nutrient.unit}`}
                    subtitle={
                      nutrient.hasGoal
                        ? `${nutrient.percent?.toFixed(0)}% of goal`
                        : ""
                    }
                    color={getColor(nutrient.percent, nutrient.hasGoal)}
                    compact={activeTab !== "main"}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
);

NutrientOverview.displayName = "NutrientOverview";

export default NutrientOverview;
