// components/dashboard/RecentMealsCard.tsx
import Link from "next/link";
import React, { forwardRef } from "react";
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

const RecentMealsCard = forwardRef<
  { refresh: () => Promise<void> },
  RecentMealsCardProps
>(({ recentMeals }, ref) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Recent Meals
      </h2>
      <div className="space-y-3">
        {recentMeals?.length ? (
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
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <LuUtensils className="w-14 h-14 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No recent meals logged
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Log your meals to see them here
            </p>
            <Link href="/foodlog">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
                Log Meal
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
});

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
  console.log(nutrients);
  console.log(nutrientsDict);
  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div>
        <div className="font-medium text-gray-900 dark:text-white">{name}</div>
      </div>
      <div className="text-right">
        <div className="font-bold text-gray-900 dark:text-white">
          {nutrientsDict["calories"].toFixed(2)} cal
        </div>
      </div>
    </div>
  );
}

export default RecentMealsCard;