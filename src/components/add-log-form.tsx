"use client";

import React, { useState, useEffect } from "react";

// Assuming these types are imported or defined in a shared types file
type Ingredient = { id: string; name: string; brand: string | null };
type Recipe = { id: string; name: string };

interface AddLogFormProps {
  selectedDate: string;
  onLogSuccess: () => void; // Callback to refresh logs in the parent
}

export default function AddLogForm({
  selectedDate,
  onLogSuccess,
}: AddLogFormProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  // --- Utility functions for search ---

  // Search ingredients
  useEffect(() => {
    if (!isOpen) return;
    if (ingredientQuery.length < 2) return setIngredientResults([]);
    const timeout = setTimeout(async () => {
      const res = await fetch(
        `/api/ingredients/search?q=${encodeURIComponent(ingredientQuery)}`
      );
      const data = await res.json();
      if (data.success) setIngredientResults(data.ingredients || data.results);
    }, 300);
    return () => clearTimeout(timeout);
  }, [ingredientQuery, isOpen]);

  // Search recipes
  useEffect(() => {
    if (!isOpen) return;
    if (recipeQuery.length < 2) return setRecipeResults([]);
    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/recipes/search?q=${recipeQuery}`);
      const data = await res.json();
      if (data.success) setRecipeResults(data.recipes || data.results);
    }, 300);
    return () => clearTimeout(timeout);
  }, [recipeQuery, isOpen]);

  // Reset form function
  const resetForm = () => {
    setIngredientQuery("");
    setRecipeQuery("");
    setSelectedIngredient(null);
    setSelectedRecipe(null);
    setQuantity("");
    setUnit("grams");
    setUpdateInventory(true);
  };

  // Close modal and reset state
  const handleClose = () => {
    resetForm();
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!selectedIngredient && !selectedRecipe) {
      alert("Please select either an ingredient or a recipe");
      setIsSubmitting(false);
      return;
    }

    if (!quantity) {
      alert("Please enter quantity");
      setIsSubmitting(false);
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
        onLogSuccess(); // Notify parent to refresh logs
        handleClose();
        // Optional: show a toast/non-intrusive notification instead of alert
        // alert("Food logged successfully!");
      } else {
        console.error("Error data:", data.error);
        alert("Error logging food: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error logging food");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200 shadow-md flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Log Food
      </button>

      {/* Modal Backdrop and Content */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4 transform transition-all">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-gray-200 dark:border-gray-700">
              <h2
                id="modal-title"
                className="text-xl font-semibold text-gray-900 dark:text-white"
              >
                Log Food for {new Date(selectedDate).toLocaleDateString()}
              </h2>
              <button
                onClick={handleClose}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Log Form */}
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

              {/* Search and Selection Content */}
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
                    <ul className="mt-2 border border-gray-200 dark:border-gray-600 rounded-lg max-h-40 overflow-y-auto">
                      {ingredientResults.map((ing) => (
                        <li
                          key={ing.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
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
                    <ul className="mt-2 border border-gray-200 dark:border-gray-600 rounded-lg max-h-40 overflow-y-auto">
                      {recipeResults.map((rec) => (
                        <li
                          key={rec.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
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
                  className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-800 dark:disabled:bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Logging...
                  </>
                ) : (
                  "Log Food"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
