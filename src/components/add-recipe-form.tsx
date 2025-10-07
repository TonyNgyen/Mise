"use client";

import { useState, useEffect, useCallback } from "react";
// Assuming you have lucide-react installed for professional icons
import {
  LuPlus,
  LuX,
  LuTrash2,
  LuLoader,
  LuBookOpen,
  LuSearch,
} from "react-icons/lu"; // Using lucide-react for icons

// --- Type Definitions (Improved) ---
type Ingredient = {
  id: string;
  name: string;
  brand: string | null;
  serving_unit: string | null;
};

type IngredientRow = {
  ingredient_id: string;
  ingredient_name: string;
  quantity: string;
  unit: string;
  searchResults?: Ingredient[];
  isSearching?: boolean;
  isSelected: boolean;
  // Store selected ingredient details for display/reset
  selectedIngredient?: Ingredient;
};

// --- AddRecipeForm Component ---
export default function AddRecipeForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [servings, setServings] = useState<number>(1);
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

  // --- Utility Functions ---

  const createNewIngredientRow = (): IngredientRow => ({
    ingredient_id: "",
    ingredient_name: "",
    quantity: "",
    unit: "",
    isSelected: false,
  });

  const addIngredient = () => {
    setIngredients([...ingredients, createNewIngredientRow()]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const resetForm = () => {
    setName("");
    setServings(1);
    setIngredients([createNewIngredientRow()]);
    setIsSubmitting(false);
  };

  const openModal = () => setIsModalOpen(true);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    resetForm();
  }, []);

  // --- Search & Selection Logic ---

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
      // NOTE: In a real Next.js/DB app, this API call would use the built-in database ORM (Prisma/Neon)
      // Since the prompt suggests a `/api/ingredients/search` endpoint, we'll keep the fetch call.
      const res = await fetch(
        `/api/ingredients/search?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      // Simulate slow network to show loading state better (remove in production)
      // await new Promise(resolve => setTimeout(resolve, 500));

      if (data.success) {
        setIngredients((prev) =>
          prev.map((ing, i) =>
            i === index
              ? { ...ing, searchResults: data.ingredients, isSearching: false }
              : ing
          )
        );
      } else {
        throw new Error("Search failed");
      }
    } catch (error) {
      console.error("Search error:", error);
      setIngredients((prev) =>
        prev.map((ing, i) =>
          i === index ? { ...ing, isSearching: false, searchResults: [] } : ing
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
              unit: ingredient.serving_unit || "g", // Use default unit
              searchResults: [],
              isSearching: false,
              isSelected: true,
              selectedIngredient: ingredient,
            }
          : ing
      )
    );
  };

  const deselectIngredient = (index: number) => {
    setIngredients((prev) =>
      prev.map((ing, i) =>
        i === index
          ? {
              ...ing,
              ingredient_id: "",
              ingredient_name: ing.selectedIngredient?.name || "",
              quantity: "",
              unit: "",
              isSelected: false,
              selectedIngredient: undefined,
              searchResults: [],
            }
          : ing
      )
    );
  };

  const handleInputChange = (
    index: number,
    field: keyof IngredientRow,
    value: string | number
  ) => {
    setIngredients((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // --- Submission Logic ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Filter out rows without a selected ingredient or quantity
    const ingredientsToSend = ingredients
      .filter((ing) => ing.ingredient_id && ing.quantity && ing.unit)
      .map(({ ingredient_id, quantity, unit }) => ({
        ingredient_id,
        quantity: parseFloat(quantity),
        unit: unit.trim(),
      }));

    if (ingredientsToSend.length === 0) {
      alert("Please select and enter quantity for at least one ingredient.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          servings: Number(servings),
          ingredients: ingredientsToSend,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        alert("Recipe created successfully! 🎉");
        closeModal(); // Use the callback for cleanup
      } else {
        alert(`Failed to create recipe: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error creating recipe:", error);
      alert("An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Modal Control Effects ---

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
  }, [isModalOpen, closeModal]);

  // --- Render Logic ---

  return (
    <>
      {/* Trigger Button (Styled to fit a common theme) */}
      <button
        onClick={openModal}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-md transition-all duration-200 ease-in-out transform hover:scale-[1.01]"
      >
        <LuBookOpen size={20} />
        Add New Recipe
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/75 dark:bg-black/90 flex items-center justify-center p-4 z-50 transition-opacity duration-300"
          onClick={handleBackdropClick}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col transition-all duration-300 transform scale-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create New Recipe
              </h1>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={isSubmitting}
                aria-label="Close modal"
              >
                <LuX size={24} />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 pt-6 overflow-y-auto"
            >
              {/* --- 1. Recipe Info --- */}
              <section className="space-y-4">
                <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 border-b border-indigo-100 dark:border-gray-700 pb-1">
                  Recipe Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Recipe Name */}
                  <div>
                    <label
                      htmlFor="recipe-name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Recipe Name *
                    </label>
                    <input
                      id="recipe-name"
                      type="text"
                      placeholder="e.g., Chicken Alfredo Pasta"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Servings */}
                  <div>
                    <label
                      htmlFor="servings"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Number of Servings *
                    </label>
                    <input
                      id="servings"
                      type="number"
                      min="1"
                      step="1"
                      placeholder="4"
                      value={servings}
                      onChange={(e) => setServings(e.target.valueAsNumber)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </section>

              {/* --- 2. Ingredients Section --- */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 border-b border-indigo-100 dark:border-gray-700 pb-1">
                    Ingredients List
                  </h2>
                  <button
                    type="button"
                    onClick={addIngredient}
                    disabled={isSubmitting}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <LuPlus size={16} />
                    Add Item
                  </button>
                </div>

                {/* Ingredient Rows */}
                <div className="space-y-3">
                  {ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className={`
                        flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200
                        ${
                          ing.isSelected
                            ? "bg-indigo-50 dark:bg-gray-700/70 border-indigo-200 dark:border-indigo-800"
                            : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700"
                        }
                      `}
                    >
                      {/* --- Quantity Input (Narrow) --- */}
                      <div className="w-1/6 min-w-[70px]">
                        <label className="sr-only">Quantity</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0.1"
                          placeholder="1"
                          value={ing.quantity}
                          onChange={(e) =>
                            handleInputChange(idx, "quantity", e.target.value)
                          }
                          className="w-full px-2 py-2 text-center border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors text-sm"
                          required={ing.isSelected}
                          disabled={isSubmitting || !ing.isSelected}
                        />
                      </div>

                      {/* --- Unit Input (Narrow) --- */}
                      <div className="w-1/6 min-w-[60px]">
                        <label className="sr-only">Unit</label>
                        <input
                          type="text"
                          placeholder="g"
                          value={ing.unit}
                          onChange={(e) =>
                            handleInputChange(idx, "unit", e.target.value)
                          }
                          className="w-full px-2 py-2 text-center border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-colors text-sm"
                          required={ing.isSelected}
                          disabled={isSubmitting || !ing.isSelected}
                        />
                      </div>

                      {/* --- Ingredient Name (Search/Selected Tag) (Wide) --- */}
                      <div className="flex-1 relative">
                        {ing.isSelected ? (
                          // Selected Tag Display
                          <div className="flex items-center justify-between px-3 py-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg border border-indigo-300 dark:border-indigo-700 text-sm font-medium text-indigo-800 dark:text-indigo-200 transition-colors">
                            <span className="truncate">
                              {ing.selectedIngredient?.name}
                              {ing.selectedIngredient?.brand && (
                                <span className="text-xs text-indigo-600 dark:text-indigo-400 ml-1">
                                  ({ing.selectedIngredient.brand})
                                </span>
                              )}
                            </span>
                            <button
                              type="button"
                              onClick={() => deselectIngredient(idx)}
                              disabled={isSubmitting}
                              className="ml-2 text-indigo-500 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-100 p-0.5 rounded-full hover:bg-indigo-200/50 dark:hover:bg-indigo-800/50 transition-colors"
                            >
                              <LuX size={14} />
                            </button>
                          </div>
                        ) : (
                          // Search Input Field
                          <>
                            <input
                              type="text"
                              placeholder="Search or type ingredient name..."
                              value={ing.ingredient_name}
                              onChange={(e) => {
                                const val = e.target.value;
                                handleInputChange(idx, "ingredient_name", val);
                                searchIngredients(val, idx);
                              }}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors text-sm pr-10"
                              disabled={isSubmitting}
                              required={!ing.isSelected}
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                              {ing.isSearching ? (
                                <LuLoader
                                  size={16}
                                  className="animate-spin text-indigo-500"
                                />
                              ) : (
                                <LuSearch size={16} />
                              )}
                            </div>
                          </>
                        )}

                        {/* Search results dropdown */}
                        {!ing.isSelected &&
                          ing.searchResults &&
                          ing.searchResults.length > 0 && (
                            <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl max-h-60 overflow-y-auto ring-1 ring-black/5">
                              {ing.searchResults.map((res) => (
                                <li
                                  key={res.id}
                                  className="px-4 py-2 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors border-b dark:border-gray-600 last:border-b-0"
                                  onClick={() =>
                                    !isSubmitting && selectIngredient(idx, res)
                                  }
                                >
                                  <div className="font-semibold text-gray-900 dark:text-white leading-tight">
                                    {res.name}
                                  </div>
                                  {res.brand || res.serving_unit ? (
                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                                      {res.brand && (
                                        <span className="mr-2">
                                          {res.brand}
                                        </span>
                                      )}
                                      {res.serving_unit && (
                                        <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400">
                                          Default unit: {res.serving_unit}
                                        </span>
                                      )}
                                    </div>
                                  ) : null}
                                </li>
                              ))}
                            </ul>
                          )}
                      </div>

                      {/* --- Remove Button --- */}
                      {ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIngredient(idx)}
                          disabled={isSubmitting}
                          className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                          aria-label={`Remove ingredient ${idx + 1}`}
                        >
                          <LuTrash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* --- Form Actions --- */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:disabled:bg-indigo-400 text-white rounded-xl font-bold transition-colors shadow-md shadow-indigo-500/30 dark:shadow-indigo-500/20 flex items-center justify-center disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <LuLoader size={18} className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Recipe"
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
