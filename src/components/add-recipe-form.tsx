"use client";

import { useState, useEffect } from "react";

type Ingredient = {
  id: string;
  name: string;
  brand: string | null;
  serving_unit: string | null; // Add serving_unit to the type
};

type IngredientRow = {
  ingredient_id: string;
  ingredient_name: string;
  quantity: string;
  unit: string;
  searchResults?: Ingredient[];
  isSearching?: boolean;
  isSelected?: boolean; // New flag to track if ingredient is selected
};

export default function AddRecipeForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [servings, setServings] = useState(1);
  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    {
      ingredient_id: "",
      ingredient_name: "",
      quantity: "",
      unit: "",
      isSelected: false,
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        ingredient_id: "",
        ingredient_name: "",
        quantity: "",
        unit: "",
        isSelected: false,
      },
    ]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          servings: Number(servings),
          ingredients: ingredients.filter(
            (ing) => ing.ingredient_id && ing.quantity
          ),
        }),
      });

      const data = await res.json();
      console.log("Recipe created:", data);

      if (data.success) {
        // Reset form on success
        setName("");
        setServings(1);
        setIngredients([
          {
            ingredient_id: "",
            ingredient_name: "",
            quantity: "",
            unit: "",
            isSelected: false,
          },
        ]);
        setIsModalOpen(false); // Close modal on success
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const searchIngredients = async (query: string, index: number) => {
    if (!query || query.length < 2) {
      setIngredients((prev) =>
        prev.map((ing, i) =>
          i === index ? { ...ing, searchResults: [] } : ing
        )
      );
      return;
    }

    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, isSearching: true } : ing))
    );

    try {
      const res = await fetch(
        `/api/ingredients/search?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      console.log("Search ingredients response:", res);

      if (data.success) {
        setIngredients((prev) =>
          prev.map((ing, i) =>
            i === index
              ? { ...ing, searchResults: data.ingredients, isSearching: false }
              : ing
          )
        );
      }
    } catch (error) {
      console.error("Search error:", error);
      setIngredients((prev) =>
        prev.map((ing, i) =>
          i === index ? { ...ing, isSearching: false } : ing
        )
      );
    }
  };

  const selectIngredient = (index: number, ingredient: Ingredient) => {
    setIngredients((prev) =>
      prev.map((ing, i) =>
        i === index
          ? {
              ...ing,
              ingredient_id: ingredient.id,
              ingredient_name: ingredient.name,
              unit: ingredient.serving_unit || "g", // Prefill with ingredient's unit or default to "g"
              searchResults: [],
              isSearching: false,
              isSelected: true, // Mark as selected
            }
          : ing
      )
    );
  };

  const resetForm = () => {
    setName("");
    setServings(1);
    setIngredients([
      {
        ingredient_id: "",
        ingredient_name: "",
        quantity: "",
        unit: "",
        isSelected: false,
      },
    ]);
    setIsSubmitting(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isModalOpen]);

  return (
    <>
      <button
        onClick={openModal}
        className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
      >
        Add Recipe
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-909 dark:text-white">
                Create Recipe
              </h1>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl cursor-pointer"
                disabled={isSubmitting}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Recipe Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Recipe Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Chicken Alfredo Pasta"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Servings *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    placeholder="4"
                    value={servings}
                    onChange={(e) => setServings(e.target.valueAsNumber)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Ingredients Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ingredients *
                  </label>
                  <button
                    type="button"
                    onClick={addIngredient}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/50 text-blue-700 dark:text-blue-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Ingredient
                  </button>
                </div>

                <div className="space-y-3">
                  {ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Ingredient {idx + 1}
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Search ingredients..."
                              value={ing.ingredient_name}
                              onChange={(e) => {
                                const val = e.target.value;
                                setIngredients((prev) =>
                                  prev.map((item, i) =>
                                    i === idx
                                      ? {
                                          ...item,
                                          ingredient_name: val,
                                          isSelected: false, // Reset selection when typing
                                        }
                                      : item
                                  )
                                );
                                searchIngredients(val, idx);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                              disabled={isSubmitting}
                            />

                            {ing.isSearching && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                              </div>
                            )}

                            {/* Search results dropdown */}
                            {ing.searchResults &&
                              ing.searchResults.length > 0 && (
                                <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                  {ing.searchResults.map((res) => (
                                    <li
                                      key={res.id}
                                      className="px-3 py-2 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                      onClick={() =>
                                        !isSubmitting &&
                                        selectIngredient(idx, res)
                                      }
                                    >
                                      <div className="font-medium text-gray-900 dark:text-white">
                                        {res.name}
                                      </div>
                                      {res.brand && (
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                          {res.brand}
                                        </div>
                                      )}
                                      {res.serving_unit && (
                                        <div className="text-xs text-gray-500 dark:text-gray-500">
                                          Default unit: {res.serving_unit}
                                        </div>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              )}
                          </div>
                        </div>

                        {ingredients.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeIngredient(idx)}
                            disabled={isSubmitting}
                            className="mt-6 p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Quantity and Unit inputs - only show when ingredient is selected */}
                      {ing.isSelected && (
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Quantity *
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              placeholder="100"
                              value={ing.quantity}
                              onChange={(e) => {
                                const val = e.target.value;
                                setIngredients((prev) =>
                                  prev.map((item, i) =>
                                    i === idx
                                      ? { ...item, quantity: val }
                                      : item
                                  )
                                );
                              }}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                              required
                              disabled={isSubmitting}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Unit
                            </label>
                            <input
                              type="text"
                              placeholder="g, ml, cups, etc."
                              value={ing.unit}
                              onChange={(e) => {
                                const val = e.target.value;
                                setIngredients((prev) =>
                                  prev.map((item, i) =>
                                    i === idx ? { ...item, unit: val } : item
                                  )
                                );
                              }}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                              disabled={isSubmitting}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-800 dark:disabled:bg-blue-500 text-white rounded-md font-semibold transition-colors duration-200 flex items-center justify-center disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    "Create Recipe"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
