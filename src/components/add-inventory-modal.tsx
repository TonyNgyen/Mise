// components/add-inventory-modal.tsx
"use client";

import React, { useState, useEffect } from "react";

type IngredientUnit = {
  id: string;
  unit_name: string;
  amount: number;
  is_default: boolean;
};

type Ingredient = {
  id: string;
  name: string;
  brand: string | null;
  serving_size: number | null;
  serving_unit: string | null;
  servings_per_container: number | null;
  units: IngredientUnit[];
};

type Recipe = { id: string; name: string };

interface AddInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddInventoryModal({
  isOpen,
  onClose,
  onSuccess,
}: AddInventoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ingredientQuery, setIngredientQuery] = useState("");
  const [recipeQuery, setRecipeQuery] = useState("");
  const [ingredientResults, setIngredientResults] = useState<Ingredient[]>([]);
  const [recipeResults, setRecipeResults] = useState<Recipe[]>([]);
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [ingredientQuantity, setIngredientQuantity] = useState("");
  const [ingredientUnit, setIngredientUnit] = useState("grams");
  const [recipeQuantity, setRecipeQuantity] = useState("");
  const [recipeUnit, setRecipeUnit] = useState("servings");
  const [activeTab, setActiveTab] = useState<"ingredient" | "recipe">(
    "ingredient"
  );
  const [availableUnits, setAvailableUnits] = useState<IngredientUnit[]>([]);

  // Search ingredients
  useEffect(() => {
    if (!isOpen) return;
    if (ingredientQuery.length < 2) return setIngredientResults([]);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/ingredients/search?q=${encodeURIComponent(ingredientQuery)}`
        );
        const data = await res.json();
        if (data.success)
          setIngredientResults(data.results || data.ingredients);
      } catch (error) {
        console.error("Search error:", error);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [ingredientQuery, isOpen]);

  // Search recipes
  useEffect(() => {
    if (!isOpen) return;
    if (recipeQuery.length < 2) return setRecipeResults([]);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/recipes/search?q=${recipeQuery}`);
        const data = await res.json();
        if (data.success) setRecipeResults(data.results || data.recipes);
      } catch (error) {
        console.error("Search error:", error);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [recipeQuery, isOpen]);

  // Update available units when ingredient is selected
  useEffect(() => {
    if (selectedIngredient) {
      setAvailableUnits(selectedIngredient.units);
      const defaultUnitName =
        selectedIngredient.units.find((u) => u.is_default)?.unit_name ||
        selectedIngredient.serving_unit ||
        "grams";
      setIngredientUnit(defaultUnitName);
    } else {
      setAvailableUnits([]);
      setIngredientUnit("grams");
    }
  }, [selectedIngredient]);

  const resetForm = () => {
    setIngredientQuery("");
    setRecipeQuery("");
    setSelectedIngredient(null);
    setSelectedRecipe(null);
    setIngredientQuantity("");
    setIngredientUnit("grams");
    setRecipeQuantity("");
    setRecipeUnit("servings");
    setActiveTab("ingredient");
    setIngredientResults([]);
    setRecipeResults([]);
    setIsSubmitting(false);
    setAvailableUnits([]);
  };

  const handleClose = React.useCallback(() => {
    resetForm();
    onClose();
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (activeTab === "ingredient") {
        if (!selectedIngredient) {
          alert("Please select an ingredient");
          return;
        }
        if (!ingredientQuantity) {
          alert("Please enter quantity");
          return;
        }

        let payloadQuantity = parseFloat(ingredientQuantity);
        if (ingredientUnit === "servings") {
          if (selectedIngredient.serving_size === null) {
            alert(
              "Selected ingredient must have a serving size to track servings."
            );
            return;
          }
        } else if (ingredientUnit === "containers") {
          if (
            !selectedIngredient.servings_per_container ||
            selectedIngredient.serving_size === null
          ) {
            alert("Selected ingredient does not have container/serving info.");
            return;
          }
          payloadQuantity =
            selectedIngredient.serving_size *
            selectedIngredient.servings_per_container *
            payloadQuantity;
        }

        const payload = {
          ingredient_id: selectedIngredient.id,
          recipe_id: null,
          quantity: payloadQuantity,
          unit: ingredientUnit || "grams",
        };

        const res = await fetch("/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Unknown error");
      } else {
        if (!selectedRecipe) {
          alert("Please select a recipe");
          return;
        }
        if (!recipeQuantity) {
          alert("Please enter quantity");
          return;
        }

        const payload = {
          recipe_id: selectedRecipe.id,
          quantity: parseFloat(recipeQuantity),
          p_user_id: "",
        };

        const res = await fetch("/api/inventory", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!data.success) throw new Error(data.message || "Unknown error");
      }

      onSuccess();
      handleClose();
    } catch (err: unknown) {
      console.error("Error updating inventory:", err);
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(`Error: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleClose]);

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4 border-b pb-3 border-zinc-200 dark:border-zinc-700">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Add to Inventory
          </h2>
          <button
            onClick={handleClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
            disabled={isSubmitting}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tab Selection */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => setActiveTab("ingredient")}
              className={`px-4 py-2 font-medium text-sm cursor-pointer ${
                activeTab === "ingredient"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              🥕 Ingredient
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("recipe")}
              className={`px-4 py-2 font-medium text-sm cursor-pointer ${
                activeTab === "recipe"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              📖 Recipe
            </button>
          </div>

          {/* Ingredient Search */}
          {activeTab === "ingredient" && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Search Ingredients
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={ingredientQuery}
                  onChange={(e) => {
                    setIngredientQuery(e.target.value);
                    setSelectedIngredient(null);
                  }}
                  className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-700 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 transition-colors"
                  placeholder="Search ingredients..."
                  disabled={isSubmitting}
                />

                {ingredientResults.length > 0 && !selectedIngredient && (
                  <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {ingredientResults.map((ing) => (
                      <li
                        key={ing.id}
                        className="px-4 py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors border-b border-zinc-100 dark:border-zinc-600 last:border-b-0"
                        onClick={() => {
                          setSelectedIngredient(ing);
                          setIngredientQuery(ing.name);
                          setIngredientResults([]);

                          const defaultCustomUnit = ing.units.find(
                            (u) => u.is_default
                          )?.unit_name;
                          const defaultUnit =
                            defaultCustomUnit || ing.serving_unit || "grams";
                          setIngredientUnit(defaultUnit);
                        }}
                      >
                        <div className="font-medium text-zinc-900 dark:text-white">
                          {ing.name}
                        </div>
                        {ing.brand && (
                          <div className="text-sm text-zinc-600 dark:text-zinc-400">
                            {ing.brand}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {selectedIngredient && (
                <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-green-700 dark:text-green-300 text-sm">
                    ✅ Selected: <strong>{selectedIngredient.name}</strong>
                    {selectedIngredient.brand &&
                      ` (${selectedIngredient.brand})`}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Recipe Search */}
          {activeTab === "recipe" && (
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Search Recipes
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={recipeQuery}
                  onChange={(e) => {
                    setRecipeQuery(e.target.value);
                    setSelectedRecipe(null);
                  }}
                  className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-700 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 transition-colors"
                  placeholder="Search recipes..."
                  disabled={isSubmitting}
                />

                {recipeResults.length > 0 && !selectedRecipe && (
                  <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {recipeResults.map((rec) => (
                      <li
                        key={rec.id}
                        className="px-4 py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors border-b border-zinc-100 dark:border-zinc-600 last:border-b-0"
                        onClick={() => {
                          setSelectedRecipe(rec);
                          setRecipeQuery(rec.name);
                          setRecipeResults([]);
                        }}
                      >
                        <div className="font-medium text-zinc-900 dark:text-white">
                          {rec.name}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {selectedRecipe && (
                <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-green-700 dark:text-green-300 text-sm">
                    ✅ Selected: <strong>{selectedRecipe.name}</strong>
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-4">
            {activeTab === "ingredient" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={ingredientQuantity}
                    onChange={(e) => setIngredientQuantity(e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-700 dark:text-white transition-colors"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Unit *
                  </label>
                  <select
                    value={ingredientUnit}
                    onChange={(e) => setIngredientUnit(e.target.value)}
                    className="cursor-pointer w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-700 dark:text-white transition-colors"
                    required
                    disabled={isSubmitting || !selectedIngredient}
                  >
                    <option value="servings">servings</option>

                    {selectedIngredient?.servings_per_container && (
                      <option value="containers">containers</option>
                    )}

                    {selectedIngredient?.serving_unit && (
                      <option value={selectedIngredient.serving_unit}>
                        {selectedIngredient.serving_unit}
                      </option>
                    )}

                    {availableUnits.map((unit) => (
                      <option key={unit.id} value={unit.unit_name}>
                        {unit.unit_name}
                      </option>
                    ))}

                    {!selectedIngredient && (
                      <option value="" disabled>
                        Select an Ingredient
                      </option>
                    )}
                  </select>
                </div>
              </>
            )}

            {activeTab === "recipe" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={recipeQuantity}
                    onChange={(e) => setRecipeQuantity(e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-700 dark:text-white transition-colors"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Unit *
                  </label>
                  <select
                    value={recipeUnit}
                    onChange={(e) => setRecipeUnit(e.target.value)}
                    className="cursor-pointer w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-zinc-700 dark:text-white transition-colors"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="servings">servings</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="cursor-pointer flex-1 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-800 dark:text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-800 dark:disabled:bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                "Add to Inventory"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
