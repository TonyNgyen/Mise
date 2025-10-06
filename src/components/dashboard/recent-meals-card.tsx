// components/dashboard/RecentMealsCard.tsx
import React from "react";

type FoodLogNutrient = {
  nutrient_key: string;
  amount: number;
};

// Define the shape of the data prop
interface RecentMealsCardProps {
  recentMeals: Array<{
    id: string;
    logged_at: string;
    ingredient: { name: string } | null;
    recipe: { name: string } | null;
    nutrients: FoodLogNutrient[] | null;
  }> | null;
}

export default function RecentMealsCard({ recentMeals }: RecentMealsCardProps) {
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
            const calories = meal.nutrients?.find(
              (n: FoodLogNutrient) => n.nutrient_key === "calories"
            )?.amount;

            return (
              <MealItem
                key={meal.id}
                name={name}
                calories={calories ? calories.toString() : "-"}
              />
            );
          })
        ) : (
          <div className="text-center">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No recent meals logged
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Log your meals to see them here
            </p>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Log Meal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// NOTE: Since MealItem is small and used only here, you can define it here.
// However, a cleaner Next.js structure might move it to its own file.
function MealItem({ name, calories }: { name: string; calories: string }) {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div>
        <div className="font-medium text-gray-900 dark:text-white">{name}</div>
      </div>
      <div className="text-right">
        <div className="font-bold text-gray-900 dark:text-white">
          {calories} cal
        </div>
      </div>
    </div>
  );
}
