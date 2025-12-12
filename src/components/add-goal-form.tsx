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
        className="cursor-pointer bg-[#3A8F9E] hover:bg-[#337E8D] text-white py-2 px-4 rounded-md font-semibold transition-colors duration-200 shadow-md flex items-center gap-2"
      >
        Add Goal
      </button>

      {/* Modal Backdrop and Content */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity"
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
                Set New Nutrition Goal
              </h2>
              <button
                onClick={() => setIsOpen(false)}
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

            {/* Goal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {/* Nutrient Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Nutrient *
                  </label>
                  <select
                    value={form.nutrient_key}
                    onChange={(e) => handleNutrientChange(e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white transition-colors"
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
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Target Amount *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="0.0"
                      value={form.target}
                      onChange={(e) =>
                        setForm({ ...form, target: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg dark:bg-zinc-700 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 transition-colors"
                      required
                    />
                  </div>
                  {/* Unit Display (read-only) */}
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Unit
                    </label>
                    <div className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-zinc-50 dark:bg-zinc-700 text-zinc-900 dark:text-white flex items-center justify-center flex-1">
                      {selectedNutrient ? (
                        <span className="font-medium">{currentUnit}</span>
                      ) : (
                        <span className="text-zinc-500 dark:text-zinc-400 text-xs">
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
                className="cursor-pointer w-full px-8 py-2.5 bg-[#3A8F9E] hover:bg-[#337E8D] text-white rounded-xl font-bold transition-colors shadow-md shadow-[#3A8F9E]/30 dark:shadow-[#3A8F9E]/20 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding Goal...
                  </div>
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
