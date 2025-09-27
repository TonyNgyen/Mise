"use client";

import { ALL_NUTRIENTS_DICT } from "@/constants/constants";
import React, { useEffect, useState } from "react";
import AddRecipeForm from "./add-recipe-form";

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

// Skeleton Loading Component
function NutritionSkeleton() {
  return (
    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
      </div>

      {/* Main Nutrients Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 p-4 rounded-xl text-center animate-pulse"
          >
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded-lg mx-auto mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-5/6 mx-auto"></div>
          </div>
        ))}
      </div>

      {/* Detailed Nutrients Skeleton */}
      <div className="mb-4">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"
            >
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mx-auto"></div>
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
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
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
    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
          Nutrition Facts
        </h4>
        <button
          onClick={() => setShowPerServing(!showPerServing)}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full transition-colors"
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
          <h5 className="font-medium text-gray-700 dark:text-gray-300 text-sm mb-3">
            Detailed Nutrition
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {getOtherNutrients().map((nutrient) => (
              <div
                key={nutrient.nutrient_key}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {ALL_NUTRIENTS_DICT[nutrient.nutrient_key]?.display_name ||
                    nutrient.nutrient_key}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
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

      <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
        Based on {servings} serving{servings !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

export default function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);

  // const [nutrientCache, setNutrientCache] = useState<
  //   Record<string, Nutrient[]>
  // >({});
  // const [nutrientLoading, setNutrientLoading] = useState<
  //   Record<string, boolean>
  // >({});

  useEffect(() => {
    async function fetchRecipes() {
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
    }

    fetchRecipes();
  }, []);

  function getPreviewNutrients(nutrients: Nutrient[]) {
    const keys = ["calories", "protein", "total_carbs"];
    const dict: Record<string, Nutrient | undefined> = {};
    for (const k of keys) {
      dict[k] = nutrients.find((n) => n.nutrient_key === k);
    }
    return dict;
  }

  // const fetchNutrientsForRecipe = async (recipeId: string) => {
  //   if (nutrientCache[recipeId]) return;

  //   // setNutrientLoading((prev) => ({ ...prev, [recipeId]: true }));
  //   try {
  //     const res = await fetch(`/api/recipes/${recipeId}/nutrients`);
  //     const data = await res.json();
  //     if (data.success) {
  //       setNutrientCache((prev) => ({ ...prev, [recipeId]: data.nutrients }));
  //     }
  //   } catch (err) {
  //     console.error("Error fetching recipe nutrients:", err);
  //   } finally {
  //     // setNutrientLoading((prev) => ({ ...prev, [recipeId]: false }));
  //   }
  // };

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
              className="bg-gray-200 dark:bg-gray-700 rounded-xl p-6 h-48"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 max-w-md mx-auto">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
            🍳
          </div>
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
            No recipes yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Create your first recipe to start cooking!
          </p>
          <AddRecipeForm />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Recipes
          </h1>
          <AddRecipeForm />
        </div>

        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          {recipes.length} recipe{recipes.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid gap-6">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Recipe Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                  {recipe.name}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
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
                  <div className="flex gap-6 text-sm text-gray-800 dark:text-gray-200">
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
                className="ml-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {expandedRecipe === recipe.id ? (
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

            {/* Expanded Section */}
            {expandedRecipe === recipe.id && (
              <>
                {/* Full Ingredients */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide mb-3">
                    All Ingredients
                  </h4>
                  <div className="grid gap-3">
                    {recipe.recipe_ingredients.map((ri, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {ri.ingredient.name}
                          </div>
                          {ri.ingredient.brand && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
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
