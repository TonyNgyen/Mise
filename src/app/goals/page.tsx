"use client";

import React, { useEffect, useState, useMemo } from "react";
// Assuming you have a file for types, e.g., 'types.ts'
import { ALL_NUTRIENTS_DICT } from "@/constants/constants";
import AddGoalForm from "@/components/add-goal-form";

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

// Define the shape of the form state
type GoalForm = {
  nutrient_key: string;
  target: string;
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<GoalForm>({
    nutrient_key: "",
    target: "",
  });
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);

  // NOTE: selectedNutrient, currentUnit, and nutrientCategories have been moved
  // to the GoalFormModal component to encapsulate the form's logic.

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
        // Reset form state and refetch goals on success
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

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Nutrition Goals
            </h1>{" "}
            <AddGoalForm
              form={form}
              setForm={setForm}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          </div>

          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Set and track your daily nutrition targets
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
            {goals.length} goal{goals.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Your Goals
        </h2>

        {/* Goals List */}
        {goals.length === 0 ? (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
              🎯
            </div>
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No goals yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Set your first nutrition goal!
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
                        {(
                          ((totalNutrients[goal.nutrient_key]?.amount || 0) /
                            goal.target_amount) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            ((totalNutrients[goal.nutrient_key]?.amount || 0) /
                              goal.target_amount) *
                              100
                          )}%`, // Cap progress bar at 100% visually
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
    </div>
  );
}
