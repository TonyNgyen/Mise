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
  serving_size: number | null; // Changed to allow null based on your data example
  serving_unit: string | null; // NEW: Added based on your data
  servings_per_container: number | null;
  units: IngredientUnit[]; // NEW: Added the nested units array
};

type Recipe = { id: string; name: string };

interface AddInventoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddInventoryForm({
  isOpen,
  onClose,
  onSuccess,
}: AddInventoryFormProps) {
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

  // ✅ Search ingredients
  useEffect(() => {
    if (ingredientQuery.length < 2) return setIngredientResults([]);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/ingredients/search?q=${encodeURIComponent(ingredientQuery)}`
        );
        const data = await res.json();
        console.log("Ingredient search data:", data);
        if (data.success)
          setIngredientResults(data.results || data.ingredients);
      } catch (error) {
        console.error("Search error:", error);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [ingredientQuery]);

  // ✅ Search recipes
  useEffect(() => {
    if (recipeQuery.length < 2) return setRecipeResults([]);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/recipes/search?q=${recipeQuery}`);
        const data = await res.json();
        console.log("Recipe search data:", data);
        if (data.success) setRecipeResults(data.results || data.recipes);
      } catch (error) {
        console.error("Search error:", error);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [recipeQuery]);

  useEffect(() => {
    if (selectedIngredient) {
      // Use the units already fetched with the ingredient search result
      setAvailableUnits(selectedIngredient.units);

      // This logic can be removed if handled in the onClick, but keep it
      // here to ensure state consistency if selectedIngredient is set elsewhere.
      const defaultUnitName =
        selectedIngredient.units.find((u) => u.is_default)?.unit_name ||
        selectedIngredient.serving_unit ||
        "grams";
      setIngredientUnit(defaultUnitName);
    } else {
      // Clear if no ingredient is selected
      setAvailableUnits([]);
      setIngredientUnit("grams"); // Default unit when nothing is selected
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

    let payload: {
      ingredient_id: string | null;
      recipe_id: string | null;
      quantity: number;
      unit: string;
    };

    if (activeTab === "ingredient") {
      if (!selectedIngredient) {
        alert("Please select an ingredient");
        setIsSubmitting(false);
        return;
      }
      if (!ingredientQuantity) {
        alert("Please enter quantity");
        setIsSubmitting(false);
        return;
      }
      let payloadQuantity = parseFloat(ingredientQuantity);
      if (ingredientUnit === "servings") {
        if (selectedIngredient.serving_size === null) {
          alert(
            "Selected ingredient must have a serving size to track servings."
          );
          setIsSubmitting(false);
          return;
        }
        payloadQuantity = selectedIngredient.serving_size * payloadQuantity;
      } else if (ingredientUnit === "containers") {
        // Containers: Convert to the standard unit amount
        if (
          !selectedIngredient.servings_per_container ||
          selectedIngredient.serving_size === null
        ) {
          alert("Selected ingredient does not have container/serving info.");
          setIsSubmitting(false);
          return;
        }
        payloadQuantity =
          selectedIngredient.serving_size *
          selectedIngredient.servings_per_container *
          payloadQuantity;
      }
      payload = {
        ingredient_id: selectedIngredient.id,
        recipe_id: null,
        quantity: payloadQuantity,
        unit: ingredientUnit || "grams",
      };
    } else {
      if (!selectedRecipe) {
        alert("Please select a recipe");
        setIsSubmitting(false);
        return;
      }
      if (!recipeQuantity) {
        alert("Please enter quantity");
        setIsSubmitting(false);
        return;
      }
      payload = {
        ingredient_id: null,
        recipe_id: selectedRecipe.id,
        quantity: parseFloat(recipeQuantity),
        unit: recipeUnit,
      };
    }

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        onSuccess();
        handleClose(); // calls resetForm
      } else {
        alert("Failed to add item: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error adding to inventory:", error);
      alert("Failed to add item. Please try again.");
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
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add to Inventory
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl cursor-pointer"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tab Selection */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setActiveTab("ingredient")}
              className={`px-4 py-2 font-medium text-sm cursor-pointer ${
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
              className={`px-4 py-2 font-medium text-sm cursor-pointer ${
                activeTab === "recipe"
                  ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              📖 Recipe
            </button>
          </div>

          {/* Ingredient Search */}
          {activeTab === "ingredient" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Ingredients
              </label>
              {/* {ingredientQuantity}
              {ingredientUnit} */}
              <div className="relative">
                <input
                  type="text"
                  value={ingredientQuery}
                  onChange={(e) => {
                    setIngredientQuery(e.target.value);
                    setSelectedIngredient(null);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                  placeholder="Search ingredients..."
                  disabled={isSubmitting}
                />

                {ingredientResults.length > 0 && !selectedIngredient && (
                  <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {ingredientResults.map((ing) => (
                      <li
                        key={ing.id}
                        className="px-4 py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors border-b border-gray-100 dark:border-gray-600 last:border-b-0"
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
                        <div className="font-medium text-gray-900 dark:text-white">
                          {ing.name}
                        </div>
                        {ing.brand && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
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
              <button
                onClick={() => console.log(selectedRecipe)}
                className="bg-red-100 p-4 rounded-md text-black"
              >
                Selected Recipe
              </button>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                  placeholder="Search recipes..."
                  disabled={isSubmitting}
                />

                {recipeResults.length > 0 && !selectedRecipe && (
                  <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {recipeResults.map((rec) => (
                      <li
                        key={rec.id}
                        className="px-4 py-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                        onClick={() => {
                          setSelectedRecipe(rec);
                          setRecipeQuery(rec.name);
                          setRecipeResults([]);
                        }}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
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

          <div className="grid grid-cols-2 gap-4">
            {activeTab === "ingredient" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={ingredientQuantity}
                    onChange={(e) => setIngredientQuantity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Unit *
                  </label>
                  <select
                    value={ingredientUnit}
                    onChange={(e) => setIngredientUnit(e.target.value)}
                    className="cursor-pointer w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    required
                    // Disabled if no ingredient is selected
                    disabled={isSubmitting || !selectedIngredient}
                  >
                    {/* Always include 'servings' and 'containers' (if applicable) */}
                    <option value="servings">servings</option>

                    {selectedIngredient?.servings_per_container && (
                      <option value="containers">containers</option>
                    )}

                    {/* Standard Serving Unit (e.g., 'grams' or 'mL') */}
                    {selectedIngredient?.serving_unit && (
                      <option value={selectedIngredient.serving_unit}>
                        {selectedIngredient.serving_unit}
                        {/* Optional: Add serving size info */}
                        {selectedIngredient.serving_size
                          ? ` (${selectedIngredient.serving_size})`
                          : ""}
                      </option>
                    )}

                    {/* Custom Units from the database (availableUnits state) */}
                    {availableUnits.map((unit) => (
                      <option key={unit.id} value={unit.unit_name}>
                        {unit.unit_name}
                      </option>
                    ))}

                    {/* Default / Placeholder option */}
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={recipeQuantity}
                    onChange={(e) => setRecipeQuantity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Unit *
                  </label>
                  <select
                    value={recipeUnit}
                    onChange={(e) => setRecipeUnit(e.target.value)}
                    className="cursor-pointer w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    required
                    disabled={isSubmitting}
                  >
                    <option value="servings">servings</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="cursor-pointer flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
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
