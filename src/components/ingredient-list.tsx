"use client";

import { useEffect, useState } from "react";
import AddIngredientForm from "./add-ingredient-form";

type Nutrient = {
  id: number;
  nutrient_key: string;
  display_name: string;
  unit: string;
  amount: number;
};

type Ingredient = {
  id: number;
  name: string;
  brand?: string;
  serving_size?: number;
  serving_unit?: string;
  servings_per_container?: number;
  nutrients: Nutrient[];
};

export default function IngredientsList() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIngredient, setExpandedIngredient] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchIngredients = async () => {
      setLoading(true);

      try {
        const res = await fetch("/api/ingredients", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (data.error) {
          console.error("Error fetching ingredients:", data.error);
        } else {
          // Reshape nutrients for easier rendering
          const formatted = data.ingredients.map((ing: any) => ({
            id: ing.id,
            name: ing.name,
            brand: ing.brand,
            serving_size: ing.serving_size,
            serving_unit: ing.serving_unit,
            servings_per_container: ing.servings_per_container,
            nutrients: ing.nutrients.map((n: any) => ({
              id: n.id,
              amount: n.amount,
              nutrient_key: n.nutrient_key,
              display_name: n.display_name,
              unit: n.unit,
            })),
          }));
          setIngredients(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch ingredients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedIngredient(expandedIngredient === id ? null : id);
  };

  const getMainNutrients = (nutrients: Nutrient[]) => {
    const mainKeys = ["calories", "protein", "total_fat", "total_carbs"];
    return nutrients.filter((n) => mainKeys.includes(n.nutrient_key));
  };

  const getOtherNutrients = (nutrients: Nutrient[]) => {
    const mainKeys = ["calories", "protein", "total_fat", "total_carbs"];
    return nutrients.filter(
      (n) => !mainKeys.includes(n.nutrient_key) && n.amount > 0
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (ingredients.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 max-w-md mx-auto">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
            🥗
          </div>
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
            No ingredients yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Add your first ingredient to get started with meal prep!
          </p>
          <AddIngredientForm />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Ingredients
          </h1>
          <AddIngredientForm />
        </div>

        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          {ingredients.length} ingredient{ingredients.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid gap-4">
        {ingredients.map((ingredient) => (
          <div
            key={ingredient.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-1">
                  {ingredient.name}
                </h2>
                {ingredient.brand && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Brand: {ingredient.brand}
                  </p>
                )}
                <div className="space-y-1 mt-1">
                  {ingredient.serving_size && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Serving: {ingredient.serving_size}{" "}
                      {ingredient.serving_unit}
                    </p>
                  )}
                  {ingredient.servings_per_container && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Servings per container:{" "}
                      {ingredient.servings_per_container}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => toggleExpand(ingredient.id)}
                className="ml-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
              >
                {expandedIngredient === ingredient.id ? (
                  <svg
                    className="w-5 h-5 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Minimal Main Nutrition Facts */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                {getMainNutrients(ingredient.nutrients).map((nutrient) => (
                  <div key={nutrient.id} className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {nutrient.amount}
                      <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">
                        {nutrient.unit}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {nutrient.display_name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expandable Section */}
            {expandedIngredient === ingredient.id && (
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 text-sm uppercase tracking-wide">
                  Full Nutrition Facts
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getOtherNutrients(ingredient.nutrients).map((nutrient) => (
                    <div
                      key={nutrient.id}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {nutrient.display_name}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {nutrient.amount} {nutrient.unit}
                      </span>
                    </div>
                  ))}
                </div>

                {getOtherNutrients(ingredient.nutrients).length === 0 && (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-sm">No additional nutrition data</p>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions */}
            {/* <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <button className="px-3 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                Edit
              </button>
              <button className="px-3 py-1 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors">
                Delete
              </button>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
}
