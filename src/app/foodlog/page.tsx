// components/FoodLogger.tsx
"use client";

import React, { useState, useEffect } from "react";

type Ingredient = { id: string; name: string; brand: string | null };
type Recipe = { id: string; name: string };
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

export default function FoodLogger() {
  const [activeTab, setActiveTab] = useState<"ingredient" | "recipe">(
    "ingredient"
  );
  const [ingredientQuery, setIngredientQuery] = useState("");
  const [recipeQuery, setRecipeQuery] = useState("");
  const [ingredientResults, setIngredientResults] = useState<Ingredient[]>([]);
  const [recipeResults, setRecipeResults] = useState<Recipe[]>([]);
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("grams");
  const [updateInventory, setUpdateInventory] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  // Search ingredients
  useEffect(() => {
    if (ingredientQuery.length < 2) return setIngredientResults([]);
    const timeout = setTimeout(async () => {
      const res = await fetch(
        `/api/ingredients/search?q=${encodeURIComponent(ingredientQuery)}`
      );
      const data = await res.json();
      if (data.success) setIngredientResults(data.ingredients || data.results);
    }, 300);
    return () => clearTimeout(timeout);
  }, [ingredientQuery]);

  useEffect(() => {
    if (recipeQuery.length < 2) return setRecipeResults([]);
    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/recipes/search?q=${recipeQuery}`);
      const data = await res.json();
      if (data.success) setRecipeResults(data.recipes || data.results);
    }, 300);
    return () => clearTimeout(timeout);
  }, [recipeQuery]);

  const fetchFoodLogs = async (date: string) => {
    const res = await fetch(`/api/food-logs?date=${date}`);
    const data = await res.json();
    if (data.success) setFoodLogs(data.food_logs || []);
  };

  useEffect(() => {
    fetchFoodLogs(selectedDate);
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!selectedIngredient && !selectedRecipe) {
      alert("Please select either an ingredient or a recipe");
      return;
    }

    if (!quantity) {
      alert("Please enter quantity");
      return;
    }

    try {
      const res = await fetch("/api/food-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredient_id: selectedIngredient?.id || null,
          recipe_id: selectedRecipe?.id || null,
          quantity: parseFloat(quantity),
          unit,
          logged_at: new Date(selectedDate).toISOString(),
          update_inventory: updateInventory,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Reset form
        setIngredientQuery("");
        setRecipeQuery("");
        setSelectedIngredient(null);
        setSelectedRecipe(null);
        setQuantity("");
        setUnit("grams");

        // Refresh logs
        await fetchFoodLogs(selectedDate);

        alert("Food logged successfully!");
      } else {
        console.log("Error data:", data.error);
        alert("Error logging food: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error logging food");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const totalNutrients = getTotalNutrients();

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Food Log
      </h1>

      {/* Log Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Log Food
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Log Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tab Selection */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setActiveTab("ingredient")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "ingredient"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              🥕 Ingredient
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("recipe")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "recipe"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              📖 Recipe
            </button>
          </div>

          {/* Search and Selection */}
          {activeTab === "ingredient" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Ingredients
              </label>
              <input
                type="text"
                value={ingredientQuery}
                onChange={(e) => {
                  setIngredientQuery(e.target.value);
                  setSelectedIngredient(null);
                }}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Search ingredients..."
                disabled={isSubmitting}
              />

              {ingredientResults.length > 0 && !selectedIngredient && (
                <ul className="mt-2 border border-gray-200 dark:border-gray-600 rounded-lg">
                  {ingredientResults.map((ing) => (
                    <li
                      key={ing.id}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setSelectedIngredient(ing);
                        setIngredientQuery(ing.name);
                        setIngredientResults([]);
                        setUnit("grams");
                      }}
                    >
                      {ing.name} {ing.brand && `(${ing.brand})`}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Recipes
              </label>
              <input
                type="text"
                value={recipeQuery}
                onChange={(e) => {
                  setRecipeQuery(e.target.value);
                  setSelectedRecipe(null);
                }}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Search recipes..."
                disabled={isSubmitting}
              />

              {recipeResults.length > 0 && !selectedRecipe && (
                <ul className="mt-2 border border-gray-200 dark:border-gray-600 rounded-lg">
                  {recipeResults.map((rec) => (
                    <li
                      key={rec.id}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        setSelectedRecipe(rec);
                        setRecipeQuery(rec.name);
                        setRecipeResults([]);
                        setUnit("servings");
                      }}
                    >
                      {rec.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Unit *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                required
                disabled={isSubmitting}
              >
                <option value="grams">grams (g)</option>
                <option value="servings">servings</option>
              </select>
            </div>
          </div>

          {/* Inventory Update Option */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="updateInventory"
              checked={updateInventory}
              onChange={(e) => setUpdateInventory(e.target.checked)}
              className="mr-2"
              disabled={isSubmitting}
            />
            <label
              htmlFor="updateInventory"
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              Update inventory (reduce quantity by logged amount)
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-semibold disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Logging..." : "Log Food"}
          </button>
        </form>
      </div>

      {/* Food Logs and Nutrition Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Daily Summary - {new Date(selectedDate).toLocaleDateString()}
          </h2>
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="text-sm text-blue-600 dark:text-blue-400"
          >
            {showLogs ? "Hide Details" : "Show Details"}
          </button>
        </div>

        {/* Nutrition Totals */}
        {Object.keys(totalNutrients).length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Total Nutrients
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(totalNutrients).map(([key, nutrient]) => (
                <div
                  key={key}
                  className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center"
                >
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {nutrient.amount.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 uppercase">
                    {nutrient.unit}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 capitalize">
                    {key.replace(/_/g, " ")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Food Logs Details */}
        {showLogs && (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Food Logs
            </h3>
            {foodLogs.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No food logged for this date
              </p>
            ) : (
              <div className="space-y-3">
                {foodLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border border-gray-200 dark:border-gray-600 p-3 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {log.ingredient
                            ? log.ingredient.name
                            : log.recipe?.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {log.quantity} {log.unit}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(log.logged_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
