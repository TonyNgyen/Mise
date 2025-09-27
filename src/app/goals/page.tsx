"use client";

import React, { useEffect, useState, useMemo } from "react";
import { ALL_NUTRIENTS, ALL_NUTRIENTS_DICT } from "@/constants/constants";

type Goal = {
  id: string;
  nutrient_key: string;
  target_amount: number;
  created_at: string;
};

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

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nutrient_key: "",
    target: "",
  });
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);

  const selectedNutrient = useMemo(() => {
    if (form.nutrient_key && ALL_NUTRIENTS_DICT[form.nutrient_key]) {
      return ALL_NUTRIENTS.find((n) => n.key === form.nutrient_key) || null;
    }
    return null;
  }, [form.nutrient_key]);

  const currentUnit = useMemo(() => {
    return selectedNutrient ? selectedNutrient.unit : "g";
  }, [selectedNutrient]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    fetchFoodLogs(today);
  }, []);

  const fetchFoodLogs = async (date: string) => {
    const res = await fetch(`/api/food-logs?date=${date}`);
    const data = await res.json();
    if (data.success) setFoodLogs(data.food_logs || []);
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

  const fetchGoals = async () => {
    try {
      const res = await fetch("/api/goals");
      const data = await res.json();
      if (data.success) {
        setGoals(data.goals);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  // Handle nutrient change - update both nutrient_key and unit in one go
  const handleNutrientChange = (nutrientKey: string) => {
    setForm((prev) => ({
      ...prev,
      nutrient_key: nutrientKey,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nutrient_key: form.nutrient_key,
          target_amount: Number(form.target),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setForm({ nutrient_key: "", target: "" });
        await fetchGoals();
      }
    } catch (error) {
      console.error("Error creating goal:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return;

    try {
      const res = await fetch(`/api/goals/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        await fetchGoals();
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const formatNutrientName = (key: string) => {
    return (
      ALL_NUTRIENTS_DICT[key]?.display_name ||
      key
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );
  };

  // Group nutrients by category for better organization
  const nutrientCategories = useMemo(
    () => ({
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
    }),
    []
  );

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Nutrition Goals
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Set and track your daily nutrition targets
          </p>
        </div>
        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          {goals.length} goal{goals.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Goal Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Add New Goal
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div>
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
              <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white">
                {selectedNutrient ? (
                  <span className="font-medium">{currentUnit}</span>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">
                    Select nutrient first
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !form.nutrient_key}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-800 dark:disabled:bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center disabled:cursor-not-allowed"
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

      {/* Goals List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Your Goals
        </h2>

        {goals.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
              🎯
            </div>
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No goals yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Add your first nutrition goal to start tracking!
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {goals.map((goal) => {
              const nutrientInfo = ALL_NUTRIENTS_DICT[goal.nutrient_key];
              return (
                <div
                  key={goal.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {nutrientInfo?.display_name ||
                          formatNutrientName(goal.nutrient_key)}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <span className="flex items-center gap-1">
                          Target: {goal.target_amount}{" "}
                          {nutrientInfo?.unit || ""}
                        </span>
                        <span className="flex items-center gap-1">
                          Added {new Date(goal.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="ml-4 p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete goal"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>
                        {((totalNutrients[goal.nutrient_key]?.amount || 0) /
                          goal.target_amount) *
                          100}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width:
                            String(
                              ((totalNutrients[goal.nutrient_key]?.amount ||
                                0) /
                                goal.target_amount) *
                                100
                            ) + "%",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tips Section */}
      {/* <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
          <span className="text-xl">💡</span>
          Goal Setting Tips
        </h3>
        <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
          <li>• Start with basic macros: protein, carbs, and fat</li>
          <li>• Set realistic, achievable targets based on your needs</li>
          <li>• Consider consulting a nutritionist for personalized goals</li>
          <li>• Track your progress weekly and adjust as needed</li>
        </ul>
      </div> */}
    </div>
  );
}
