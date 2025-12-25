// components/dashboard/RecentMealsCard.tsx
import Link from "next/link";
import React, {
  forwardRef,
  useState,
  useEffect,
  useImperativeHandle,
} from "react";
import { LuUtensils } from "react-icons/lu";

type FoodLogNutrient = {
  nutrient_key: string;
  amount: number;
};

interface RecentMealsCardProps {
  recentMeals: Array<{
    id: string;
    log_datetime: string;
    ingredient: { name: string } | null;
    recipe: { name: string } | null;
    nutrients: FoodLogNutrient[] | null;
  }> | null;
}

// Skeleton component for loading state
function MealItemSkeleton() {
  return (
    <div className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-700 rounded-lg animate-pulse">
      <div className="flex-1">
        <div className="h-5 bg-zinc-200 dark:bg-zinc-600 rounded w-3/4 mb-1"></div>
      </div>
      <div className="text-right ml-4">
        <div className="h-5 bg-zinc-200 dark:bg-zinc-600 rounded w-20"></div>
      </div>
    </div>
  );
}

const RecentMealsCard = forwardRef<
  { refresh: () => Promise<void> },
  RecentMealsCardProps
>(({ recentMeals: initialRecentMeals }, ref) => {
  const [recentMeals, setRecentMeals] = useState(initialRecentMeals);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with prop data
  useEffect(() => {
    setRecentMeals(initialRecentMeals);
  }, [initialRecentMeals]);

  const refresh = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/recent-meals");
      const data = await res.json();
      if (data.success) {
        setRecentMeals(data.meals);
      }
    } catch (error) {
      console.error("Error fetching recent meals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh,
  }));

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
        Recent Meals
      </h2>
      <div className="space-y-3">
        {isLoading ? (
          <>
            <MealItemSkeleton />
            <MealItemSkeleton />
            <MealItemSkeleton />
          </>
        ) : recentMeals?.length ? (
          recentMeals.map((meal) => {
            const name =
              meal.ingredient?.name || meal.recipe?.name || "Unknown";
            return (
              <MealItem
                key={meal.id}
                name={name}
                nutrients={meal.nutrients || []}
              />
            );
          })
        ) : (
          <div className="text-center">
            <div className="text-zinc-400 dark:text-zinc-500 mb-4">
              <LuUtensils className="w-14 h-14 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
              No recent meals logged
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-4">
              Log your meals to see them here
            </p>
            <Link href="/foodlog">
              <button className="px-4 py-2 bg-[#3A8F9E] hover:bg-[#337E8D] text-white rounded-md font-semibold transition-colors cursor-pointer">
                Log Food
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
});

RecentMealsCard.displayName = "RecentMealsCard";

function MealItem({
  name,
  nutrients,
}: {
  name: string;
  nutrients: FoodLogNutrient[];
}) {
  const nutrientsDict: { [key: string]: number } = {};
  if (Array.isArray(nutrients)) {
    nutrients.forEach((n) => {
      nutrientsDict[n.nutrient_key] = n.amount;
    });
  }

  const calories = nutrientsDict["calories"] || 0;

  return (
    <div className="flex justify-between items-center p-3 bg-zinc-50 dark:bg-zinc-700 rounded-lg">
      <div>
        <div className="font-medium text-zinc-900 dark:text-white">{name}</div>
      </div>
      <div className="text-right">
        <div className="font-bold text-zinc-900 dark:text-white">
          {calories.toFixed(0)} cal
        </div>
      </div>
    </div>
  );
}

export default RecentMealsCard;
