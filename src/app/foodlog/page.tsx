"use client";

import AddLogForm from "@/components/add-log-form";
import React, { useState, useEffect } from "react";

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

export default function FoodLogger() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  const fetchFoodLogs = async (date: string) => {
    const res = await fetch(`/api/food-logs?date=${date}`);
    const data = await res.json();
    console.log(data)
    if (data.success) setFoodLogs(data.food_logs || []);
  };

  // Function to refresh logs, passed to the modal
  const handleLogSuccess = () => {
    fetchFoodLogs(selectedDate);
  };

  // Fetch logs whenever the selected date changes
  useEffect(() => {
    fetchFoodLogs(selectedDate);
  }, [selectedDate]);

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

  // Helper to format nutrient keys for display (e.g., total_fat -> Total Fat)
  const formatNutrientKey = (key: string) => {
    return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Food Log
          </h1>
          <AddLogForm
            selectedDate={selectedDate}
            onLogSuccess={handleLogSuccess}
          />
        </div>

        {/* Date Picker and Log Button */}
        <div className="flex flex-col items-end space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="flex flex-col">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Log Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white text-sm"
            />
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Daily Summary
      </h2>

      {/* Food Logs and Nutrition Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Nutritional Overview
          </h3>
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            {showLogs ? "Hide Logs" : "Show Log Details"}
          </button>
        </div>

        {/* Nutrition Totals */}
        {Object.keys(totalNutrients).length > 0 ? (
          <div className="mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(totalNutrients).map(([key, nutrient]) => (
                <div
                  key={key}
                  className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg flex flex-col justify-center items-center"
                >
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {nutrient.amount.toFixed(1)}
                    <span className="text-xs ml-1">{nutrient.unit}</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                    {formatNutrientKey(key)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 py-4 text-center">
            No nutrient data available for this date. Log some food!
          </p>
        )}

        {/* Food Logs Details */}
        {showLogs && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Detailed Food Logs
            </h3>
            {foodLogs.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No food logged for this date
              </p>
            ) : (
              <div className="space-y-3">
                {foodLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border border-gray-200 dark:border-gray-600 p-3 rounded-lg bg-white dark:bg-gray-800"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {log.ingredient
                            ? log.ingredient.name
                            : log.recipe?.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {log.quantity} {log.unit}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 text-right">
                        {new Date(log.logged_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
