"use client";

import React, { useMemo, useState } from "react";
// Assuming you have a file for types, e.g., 'types.ts'
// and 'constants.ts' for ALL_NUTRIENTS, ALL_NUTRIENTS_DICT
import { ALL_NUTRIENTS, ALL_NUTRIENTS_DICT } from "@/constants/constants";

// Define Form type (moved from the parent for clarity in this component)
type GoalForm = {
  nutrient_key: string;
  target: string;
};

// Define props for the modal component
interface AddGoalFormProps {
  form: GoalForm;
  setForm: React.Dispatch<React.SetStateAction<GoalForm>>;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
}

// Group nutrients by category for better organization
const nutrientCategories = {
  macronutrients: ALL_NUTRIENTS.filter((n) =>
    [
      "calories",
      "protein",
      "total_fat",
      "saturated_fat",
      "trans_fat",
      "total_carbs",
      "dietary_fiber",
      "sugars",
      "added_sugars",
    ].includes(n.key)
  ),
  vitamins: ALL_NUTRIENTS.filter(
    (n) =>
      n.key.includes("vitamin") ||
      [
        "thiamin",
        "riboflavin",
        "niacin",
        "folate",
        "biotin",
        "pantothenic_acid",
      ].includes(n.key)
  ),
  minerals: ALL_NUTRIENTS.filter((n) =>
    [
      "cholesterol",
      "sodium",
      "potassium",
      "calcium",
      "iron",
      "phosphorus",
      "iodine",
      "magnesium",
      "zinc",
      "selenium",
      "copper",
      "manganese",
      "chromium",
      "molybdenum",
      "chloride",
    ].includes(n.key)
  ),
  other: ALL_NUTRIENTS.filter(
    (n) =>
      ![
        "calories",
        "protein",
        "total_fat",
        "saturated_fat",
        "trans_fat",
        "total_carbs",
        "dietary_fiber",
        "sugars",
        "added_sugars",
      ].includes(n.key) &&
      !n.key.includes("vitamin") &&
      ![
        "thiamin",
        "riboflavin",
        "niacin",
        "folate",
        "biotin",
        "pantothenic_acid",
        "cholesterol",
        "sodium",
        "potassium",
        "calcium",
        "iron",
        "phosphorus",
        "iodine",
        "magnesium",
        "zinc",
        "selenium",
        "copper",
        "manganese",
        "chromium",
        "molybdenum",
        "chloride",
      ].includes(n.key)
  ),
};

export default function AddGoalForm({
  form,
  setForm,
  handleSubmit: parentHandleSubmit, // Rename to avoid confusion
  loading,
}: AddGoalFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Derive selected nutrient and unit
  const selectedNutrient = useMemo(() => {
    if (form.nutrient_key && ALL_NUTRIENTS_DICT[form.nutrient_key]) {
      return ALL_NUTRIENTS.find((n) => n.key === form.nutrient_key) || null;
    }
    return null;
  }, [form.nutrient_key]);

  const currentUnit = useMemo(() => {
    return selectedNutrient ? selectedNutrient.unit : "g";
  }, [selectedNutrient]);

  // Handle nutrient change - update both nutrient_key and unit in one go
  const handleNutrientChange = (nutrientKey: string) => {
    setForm((prev) => ({
      ...prev,
      nutrient_key: nutrientKey,
    }));
  };

  // Wrapper for form submission to close the modal and reset the form on success
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await parentHandleSubmit(e);
    // Assuming parentHandleSubmit resets the form on success,
    // we just close the modal. If not, you'd need to check the result.
    setIsOpen(false);
  };

  // The actual modal structure and logic using Tailwind CSS
  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200 shadow-md flex items-center gap-2 cursor-pointer"
      >
        Add Goal
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
                Set New Nutrition Goal
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
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

            {/* Goal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {/* Nutrient Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nutrient *
                  </label>
                  <select
                    value={form.nutrient_key}
                    onChange={(e) => handleNutrientChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    required
                  >
                    <option value="">Select a nutrient...</option>

                    {/* Macronutrients */}
                    <optgroup label="Macronutrients">
                      {nutrientCategories.macronutrients.map((nutrient) => (
                        <option key={nutrient.key} value={nutrient.key}>
                          {nutrient.display_name}
                        </option>
                      ))}
                    </optgroup>

                    {/* Vitamins */}
                    <optgroup label="Vitamins">
                      {nutrientCategories.vitamins.map((nutrient) => (
                        <option key={nutrient.key} value={nutrient.key}>
                          {nutrient.display_name}
                        </option>
                      ))}
                    </optgroup>

                    {/* Minerals */}
                    <optgroup label="Minerals">
                      {nutrientCategories.minerals.map((nutrient) => (
                        <option key={nutrient.key} value={nutrient.key}>
                          {nutrient.display_name}
                        </option>
                      ))}
                    </optgroup>

                    {/* Other Nutrients */}
                    {nutrientCategories.other.length > 0 && (
                      <optgroup label="Other Nutrients">
                        {nutrientCategories.other.map((nutrient) => (
                          <option key={nutrient.key} value={nutrient.key}>
                            {nutrient.display_name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>

                {/* Target Amount */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Target Amount *
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="0.0"
                            value={form.target}
                            onChange={(e) => setForm({ ...form, target: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                            required
                        />
                    </div>
                    {/* Unit Display (read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Unit
                        </label>
                        <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white flex items-center justify-center">
                            {selectedNutrient ? (
                                <span className="font-medium">{currentUnit}</span>
                            ) : (
                                <span className="text-gray-500 dark:text-gray-400 text-xs">
                                    Unit
                                </span>
                            )}
                        </div>
                    </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !form.nutrient_key}
                className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-800 dark:disabled:bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding Goal...
                  </>
                ) : (
                  "Add Goal"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}