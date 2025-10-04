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
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            No recent meals logged.
          </p>
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
