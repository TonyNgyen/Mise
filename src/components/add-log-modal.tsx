// components/add-log-modal.tsx
"use client";

import React, { useState, useEffect } from "react";

type Nutrient = {
  id: string;
  unit: string;
  amount: number;
  nutrient_key: string;
};

type UnitOption = {
  id: string;
  amount: number;
  unit_name: string;
  is_default: boolean;
};

type Ingredient = {
  id: string;
  name: string;
  brand: string;
  servings_per_container: number;
  created_at: string;
  nutrients: Nutrient[];
  units: UnitOption[];
};

type Recipe = { id: string; name: string };

interface AddLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onLogSuccess?: () => void;
}

export default function AddLogModal({
  isOpen,
  onClose,
  selectedDate,
  onLogSuccess,
}: AddLogModalProps) {
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
  const [unit, setUnit] = useState("");
  const [updateInventory, setUpdateInventory] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const resetForm = () => {
    setIngredientQuery("");
    setRecipeQuery("");
    setSelectedIngredient(null);
    setSelectedRecipe(null);
    setQuantity("");
    setUnit("");
    setUpdateInventory(true);
  };

  const handleClose = () => {
    resetForm();
    onClose();
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
        onLogSuccess?.();
        handleClose();
        alert("Food logged successfully!");
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-2xl p-6 w-full max-w-lg mx-4 transform transition-all">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4 border-b pb-3 border-zinc-200 dark:border-zinc-700">
          <h2
            id="modal-title"
            className="text-xl font-semibold text-zinc-900 dark:text-white"
          >
            Log Food for {new Date(selectedDate).toLocaleDateString()}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
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
          <div className="flex border-b border-zinc-200 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => setActiveTab("ingredient")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "ingredient"
                  ? "dark:text-[#C9E6EA] dark:border-[#C9E6EA] border-b-2 border-[#3A8F9E] text-[#3A8F9E] font-semibold"
                  : "text-zinc-500 dark:text-zinc-400 dark:hover:text-[#C9E6EA] hover:font-semibold cursor-pointer border-b-2 border-transparent hover:text-[#3A8F9E] dark:hover:border-[#C9E6EA] hover:border-[#3A8F9E]"
              }`}
            >
               Ingredient
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("recipe")}
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === "recipe"
                  ? "dark:text-[#C9E6EA] dark:border-[#C9E6EA] border-b-2 border-[#3A8F9E] text-[#3A8F9E] font-semibold"
                  : "text-zinc-500 dark:text-zinc-400 dark:hover:text-[#C9E6EA] hover:font-semibold cursor-pointer border-b-2 border-transparent hover:text-[#3A8F9E] dark:hover:border-[#C9E6EA] hover:border-[#3A8F9E]"
              }`}
            >
               Recipe
            </button>
          </div>

          {/* Search and Selection Content */}
          {activeTab === "ingredient" ? (
            <div>
              <input
                type="text"
                value={ingredientQuery}
                onChange={(e) => {
                  setIngredientQuery(e.target.value);
                  setSelectedIngredient(null);
                }}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white"
                placeholder="Search ingredients..."
                disabled={isSubmitting}
              />

              {ingredientResults.length > 0 && !selectedIngredient && (
                <ul className="mt-2 border border-zinc-200 dark:border-zinc-600 rounded-lg max-h-40 overflow-y-auto">
                  {ingredientResults.map((ing) => (
                    <li
                      key={ing.id}
                      className="px-4 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 text-sm"
                      onClick={() => {
                        setSelectedIngredient(ing);
                        setIngredientQuery(ing.name);
                        setIngredientResults([]);
                        const defaultUnit = ing.units.find((u) => u.is_default);
                        if (defaultUnit) {
                          setUnit(defaultUnit.unit_name);
                        } else if (ing.units.length > 0) {
                          setUnit(ing.units[0].unit_name);
                        } else {
                          setUnit("");
                        }
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
              <input
                type="text"
                value={recipeQuery}
                onChange={(e) => {
                  setRecipeQuery(e.target.value);
                  setSelectedRecipe(null);
                }}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white"
                placeholder="Search recipes..."
                disabled={isSubmitting}
              />

              {recipeResults.length > 0 && !selectedRecipe && (
                <ul className="mt-2 border border-zinc-200 dark:border-zinc-600 rounded-lg max-h-40 overflow-y-auto">
                  {recipeResults.map((rec) => (
                    <li
                      key={rec.id}
                      className="px-4 py-2 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 text-sm"
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
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Unit *
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white"
                required
                disabled={isSubmitting}
              >
                {activeTab === "ingredient" && selectedIngredient && (
                  <>
                    {selectedIngredient.units
                      .filter((u) => u.is_default)
                      .map((u) => (
                        <option key={u.unit_name} value={u.unit_name}>
                          {u.unit_name}
                        </option>
                      ))}
                    {selectedIngredient.units
                      .filter((u) => !u.is_default)
                      .map((u) => (
                        <option key={u.unit_name} value={u.unit_name}>
                          {u.unit_name}
                        </option>
                      ))}
                  </>
                )}
                {activeTab === "recipe" && selectedRecipe && (
                  <option value="servings">servings</option>
                )}
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
              className="mr-2 h-4 w-4 text-[#3A8F9E] border-zinc-300 rounded focus:ring-[#3A8F9E]"
              disabled={isSubmitting}
            />
            <label
              htmlFor="updateInventory"
              className="text-sm text-zinc-700 dark:text-zinc-300"
            >
              Update inventory (reduce quantity by logged amount)
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="hover:bg-[#337E8D] cursor-pointer w-full bg-[#3A8F9E] text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center disabled:cursor-not-allowed"
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
  );
}

// ============================================================
// EXAMPLE USAGE IN OTHER COMPONENTS:
// ============================================================

// Example 1: With a button component
// components/add-log-button.tsx
// ("use client");

// import { useState } from "react";
// import AddLogModal from "./add-log-modal";

// export function AddLogButton({
//   selectedDate,
//   onLogSuccess,
// }: {
//   selectedDate: string;
//   onLogSuccess?: () => void;
// }) {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   return (
//     <>
//       <button
//         onClick={() => setIsModalOpen(true)}
//         className="cursor-pointer bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200 shadow-md flex items-center gap-2"
//       >
//         Log Food
//       </button>

//       <AddLogModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         selectedDate={selectedDate}
//         onLogSuccess={onLogSuccess}
//       />
//     </>
//   );
// }

// Example 2: In NutrientOverview (empty state)
// Inside your empty state:
/*
const [isModalOpen, setIsModalOpen] = useState(false);

<button 
  onClick={() => setIsModalOpen(true)}
  className="px-4 py-2 bg-blue-600 text-white rounded-md"
>
  Log Food Now
</button>

<AddLogModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  selectedDate={selectedDate}
  onLogSuccess={handleLogSuccess}
/>
*/

// Example 3: In RecentMealsCard (empty state)
// Same pattern as above
