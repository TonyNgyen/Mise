"use client";

import { ALL_NUTRIENTS_DICT } from "@/constants/constants";
import React, { useEffect, useMemo, useState } from "react";
import AddRecipeForm from "./add-recipe-form";
import { LuChefHat } from "react-icons/lu";

type Ingredient = {
  id: string;
  name: string;
  brand: string | null;
  serving_size: number | null;
  serving_unit: string | null;
};

type RecipeIngredient = {
  quantity: number;
  unit: string;
  ingredient: Ingredient;
};

type Recipe = {
  id: string;
  name: string;
  servings: number;
  created_at: string;
  recipe_ingredients: RecipeIngredient[];
  recipe_nutrients: Nutrient[]; // ✅ already coming from Supabase
};

type Nutrient = {
  nutrient_key: string;
  display_name: string;
  unit: string;
  total_amount: number;
};

const SORTABLE_KEYS = [
  { key: "name", display: "Name" },
  { key: "created_at", display: "Date" },
  { key: "calories", display: "Calories/Serving" },
  { key: "protein", display: "Protein/Serving" },
  { key: "total_fat", display: "Fat/Serving" },
  { key: "total_carbs", display: "Carbs/Serving" },
];

// Skeleton Loading Component
function NutritionSkeleton() {
  return (
    <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-1/4"></div>
        <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded-full w-20"></div>
      </div>

      {/* Main Nutrients Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-600 p-4 rounded-xl text-center animate-pulse"
          >
            <div className="h-8 bg-zinc-300 dark:bg-zinc-600 rounded-lg mx-auto mb-2"></div>
            <div className="h-4 bg-zinc-300 dark:bg-zinc-600 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-5 bg-zinc-300 dark:bg-zinc-600 rounded w-5/6 mx-auto"></div>
          </div>
        ))}
      </div>

      {/* Detailed Nutrients Skeleton */}
      <div className="mb-4">
        <div className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded w-1/3 mb-3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-zinc-100 dark:bg-zinc-700 rounded-lg animate-pulse"
            >
              <div className="h-4 bg-zinc-300 dark:bg-zinc-600 rounded w-2/3"></div>
              <div className="h-4 bg-zinc-300 dark:bg-zinc-600 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/4 mx-auto"></div>
    </div>
  );
}

function RecipeNutrients({
  servings,
  nutrients,
  loading,
}: {
  servings: number;
  nutrients: Nutrient[];
  loading: boolean;
}) {
  const [showPerServing, setShowPerServing] = useState(true);

  // Show skeleton while loading
  if (loading) {
    return <NutritionSkeleton />;
  }

  if (!nutrients || nutrients.length === 0) {
    return (
      <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-700">
        <div className="text-center py-6 text-zinc-500 dark:text-zinc-400">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm">No nutrition data available</p>
        </div>
      </div>
    );
  }

  const getMainNutrients = () => {
    const mainKeys = ["calories", "protein", "total_fat", "total_carbs"];
    return nutrients.filter((n) => mainKeys.includes(n.nutrient_key));
  };

  const getOtherNutrients = () => {
    const mainKeys = ["calories", "protein", "total_fat", "total_carbs"];
    return nutrients.filter((n) => !mainKeys.includes(n.nutrient_key));
  };

  return (
    <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-zinc-900 dark:text-white text-lg">
          Nutrition Facts
        </h4>
        <button
          onClick={() => setShowPerServing(!showPerServing)}
          className="cursor-pointer px-3 py-1 text-xs bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-700 dark:text-zinc-300 rounded-full transition-colors"
        >
          {showPerServing ? "Per Serving" : "Total"}
        </button>
      </div>

      {/* Main Nutrients Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {getMainNutrients().map((nutrient) => (
          <div
            key={nutrient.nutrient_key}
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-xl text-center"
          >
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {showPerServing
                ? (nutrient.total_amount / servings).toFixed(0)
                : nutrient.total_amount.toFixed(0)}
              <span className="text-xs text-blue-700 dark:text-blue-300 uppercase tracking-wide font-semibold ml-1">
                {nutrient.unit}
              </span>
            </div>
            <div className="text-sm text-blue-800 dark:text-blue-200 mt-2">
              {ALL_NUTRIENTS_DICT[nutrient.nutrient_key]?.display_name ||
                nutrient.nutrient_key}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Nutrients */}
      {getOtherNutrients().length > 0 && (
        <>
          <h5 className="font-medium text-zinc-700 dark:text-zinc-300 text-sm mb-3">
            Detailed Nutrition
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {getOtherNutrients().map((nutrient) => (
              <div
                key={nutrient.nutrient_key}
                className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-700 rounded-lg"
              >
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  {ALL_NUTRIENTS_DICT[nutrient.nutrient_key]?.display_name ||
                    nutrient.nutrient_key}
                </span>
                <span className="text-sm font-medium text-zinc-900 dark:text-white">
                  {showPerServing
                    ? (nutrient.total_amount / servings).toFixed(1)
                    : nutrient.total_amount.toFixed(1)}{" "}
                  {nutrient.unit}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-3 text-center">
        Based on {servings} serving{servings !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

export default function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc"); // Default to newest first

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/recipes");
      const data = await res.json();
      console.log("Fetched recipes:", data);
      if (data.success) {
        setRecipes(data.recipes);
      }
    } catch (err) {
      console.error("Error fetching recipes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const getRecipeNutrientAmountPerServing = (
    recipe: Recipe,
    nutrientKey: string
  ): number => {
    const nutrient = recipe.recipe_nutrients.find(
      (n) => n.nutrient_key === nutrientKey
    );
    // Return the total amount divided by servings, or 0
    return nutrient ? nutrient.total_amount / recipe.servings : 0;
  };

  // 👇 NEW: Memoized sorted list
  const sortedRecipes = useMemo(() => {
    // Create a mutable copy of the recipes array
    const sorted = [...recipes];

    sorted.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      if (sortKey === "name") {
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
      } else if (sortKey === "created_at") {
        // Treat dates as strings for comparison
        aValue = a.created_at;
        bValue = b.created_at;
      } else {
        // Handle sorting by nutrient (amount per serving)
        aValue = getRecipeNutrientAmountPerServing(a, sortKey);
        bValue = getRecipeNutrientAmountPerServing(b, sortKey);
      }

      // Comparison logic
      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0; // Values are equal
    });

    return sorted;
  }, [recipes, sortKey, sortDirection]);

  // 👇 NEW: Sort handler function
  const handleSortChange = (key: string) => {
    if (key === sortKey) {
      // Toggle direction if the same key is clicked
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new key, set direction to 'asc' for name/nutrient, 'desc' for date
      setSortKey(key);
      if (key === "created_at") {
        setSortDirection("desc"); // Newest first for date
      } else {
        setSortDirection("asc");
      }
    }
  };

  function getPreviewNutrients(nutrients: Nutrient[]) {
    const keys = ["calories", "protein", "total_carbs"];
    const dict: Record<string, Nutrient | undefined> = {};
    for (const k of keys) {
      dict[k] = nutrients.find((n) => n.nutrient_key === k);
    }
    return dict;
  }

  const toggleExpand = (recipeId: string) => {
    setExpandedRecipe(expandedRecipe === recipeId ? null : recipeId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-zinc-200 dark:bg-zinc-700 rounded-xl p-6 h-48"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="bg-zinc-50 dark:bg-zinc-800 rounded-xl p-8 max-w-md mx-auto">
          <div className="text-zinc-400 dark:text-zinc-500 text-6xl mb-4">
            <LuChefHat className="mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-600 dark:text-zinc-300 mb-2">
            No recipes yet
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
            Create your first recipe to start cooking!
          </p>
          <AddRecipeForm fetchRecipes={fetchRecipes} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            My Recipes
          </h1>
          <AddRecipeForm fetchRecipes={fetchRecipes} />
        </div>

        <span className="text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-700 px-3 py-1 rounded-full">
          {recipes.length} recipe{recipes.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mr-2">
          Sort by:
        </span>
        {SORTABLE_KEYS.map((item) => (
          <button
            key={item.key}
            onClick={() => handleSortChange(item.key)}
            className={`
              text-xs px-3 py-1 rounded-full transition-all duration-150 cursor-pointer
              ${
                sortKey === item.key
                  ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600 cursor-pointer"
              }
            `}
          >
            {item.display}{" "}
            {/* Display icon for active sort key and direction */}
            {sortKey === item.key && (sortDirection === "asc" ? "↑" : "↓")}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        {sortedRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Recipe Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="font-bold text-xl text-zinc-900 dark:text-white mb-2">
                  {recipe.name}
                </h2>
                <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {recipe.servings} serving{recipe.servings !== 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formatDate(recipe.created_at)}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="flex gap-6 text-sm text-zinc-800 dark:text-zinc-200">
                    {(() => {
                      const preview = getPreviewNutrients(
                        recipe.recipe_nutrients
                      );
                      return (
                        <>
                          <div>
                            <span className="font-bold">
                              {preview.calories
                                ? (
                                    preview.calories.total_amount /
                                    recipe.servings
                                  ).toFixed(0)
                                : "--"}
                            </span>{" "}
                            kcal
                          </div>
                          <div>
                            <span className="font-bold">
                              {preview.protein
                                ? (
                                    preview.protein.total_amount /
                                    recipe.servings
                                  ).toFixed(0)
                                : "--"}
                            </span>{" "}
                            g Protein
                          </div>
                          <div>
                            <span className="font-bold">
                              {preview.total_carbs
                                ? (
                                    preview.total_carbs.total_amount /
                                    recipe.servings
                                  ).toFixed(0)
                                : "--"}
                            </span>{" "}
                            g Carbs
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              <button
                onClick={() => toggleExpand(recipe.id)}
                className="ml-4 p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer"
              >
                {expandedRecipe === recipe.id ? (
                  <svg
                    className="w-5 h-5 text-zinc-600 dark:text-zinc-400"
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
                    className="w-5 h-5 text-zinc-600 dark:text-zinc-400"
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

            {/* Expanded Section */}
            {expandedRecipe === recipe.id && (
              <>
                {/* Full Ingredients */}
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
                  <h4 className="font-semibold text-zinc-700 dark:text-zinc-300 text-sm uppercase tracking-wide mb-3">
                    All Ingredients
                  </h4>
                  <div className="grid gap-3">
                    {recipe.recipe_ingredients.map((ri, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-700 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-zinc-900 dark:text-white">
                            {ri.ingredient.name}
                          </div>
                          {ri.ingredient.brand && (
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">
                              {ri.ingredient.brand}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                            {ri.quantity} {ri.unit}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nutrition */}
                <RecipeNutrients
                  servings={recipe.servings}
                  nutrients={recipe.recipe_nutrients}
                  loading={false}
                />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
