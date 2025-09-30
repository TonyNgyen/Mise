"use client";

import { useState } from "react";

// Common nutrients (typically found on most nutritional labels)
const COMMON_NUTRIENTS = [
  { key: "calories", display_name: "Calories", unit: "cal" },
  { key: "protein", display_name: "Protein", unit: "g" },
  { key: "total_fat", display_name: "Total Fat", unit: "g" },
  { key: "saturated_fat", display_name: "Saturated Fat", unit: "g" },
  { key: "trans_fat", display_name: "Trans Fat", unit: "g" },
  { key: "total_carbs", display_name: "Total Carbs", unit: "g" },
  { key: "dietary_fiber", display_name: "Dietary Fiber", unit: "g" },
  { key: "sugars", display_name: "Sugars", unit: "g" },
  { key: "added_sugars", display_name: "Added Sugars", unit: "g" },
  { key: "cholesterol", display_name: "Cholesterol", unit: "mg" },
  { key: "sodium", display_name: "Sodium", unit: "mg" },
  { key: "potassium", display_name: "Potassium", unit: "mg" },
  { key: "vitamin_d", display_name: "Vitamin D", unit: "mcg" },
  { key: "calcium", display_name: "Calcium", unit: "mg" },
  { key: "iron", display_name: "Iron", unit: "mg" },
  { key: "vitamin_a", display_name: "Vitamin A", unit: "mcg" },
  { key: "vitamin_c", display_name: "Vitamin C", unit: "mg" },
];

// Niche nutrients organized by categories
const NICHE_NUTRIENTS = {
  fats: [
    {
      key: "polyunsaturated_fat",
      display_name: "Polyunsaturated Fat",
      unit: "g",
    },
    {
      key: "monounsaturated_fat",
      display_name: "Monounsaturated Fat",
      unit: "g",
    },
  ],
  fiber: [
    { key: "soluble_fiber", display_name: "Soluble Fiber", unit: "g" },
    { key: "insoluble_fiber", display_name: "Insoluble Fiber", unit: "g" },
    { key: "sugar_alcohols", display_name: "Sugar Alcohols", unit: "g" },
  ],
  vitamins: [
    { key: "vitamin_e", display_name: "Vitamin E", unit: "mg" },
    { key: "vitamin_k", display_name: "Vitamin K", unit: "mcg" },
    { key: "thiamin", display_name: "Thiamin (B1)", unit: "mg" },
    { key: "riboflavin", display_name: "Riboflavin (B2)", unit: "mg" },
    { key: "niacin", display_name: "Niacin (B3)", unit: "mg" },
    { key: "vitamin_b6", display_name: "Vitamin B6", unit: "mg" },
    { key: "folate", display_name: "Folate", unit: "mcg" },
    { key: "vitamin_b12", display_name: "Vitamin B12", unit: "mcg" },
    { key: "biotin", display_name: "Biotin", unit: "mcg" },
    { key: "pantothenic_acid", display_name: "Pantothenic Acid", unit: "mg" },
  ],
  minerals: [
    { key: "phosphorus", display_name: "Phosphorus", unit: "mg" },
    { key: "iodine", display_name: "Iodine", unit: "mcg" },
    { key: "magnesium", display_name: "Magnesium", unit: "mg" },
    { key: "zinc", display_name: "Zinc", unit: "mg" },
    { key: "selenium", display_name: "Selenium", unit: "mcg" },
    { key: "copper", display_name: "Cupper", unit: "mg" },
    { key: "manganese", display_name: "Manganese", unit: "mg" },
    { key: "chromium", display_name: "Chromium", unit: "mcg" },
    { key: "molybdenum", display_name: "Molybdenum", unit: "mcg" },
    { key: "chloride", display_name: "Chloride", unit: "mg" },
  ],
  amino_acids: [
    { key: "tryptophan", display_name: "Tryptophan", unit: "mg" },
    { key: "threonine", display_name: "Threonine", unit: "mg" },
    { key: "isoleucine", display_name: "Isoleucine", unit: "mg" },
    { key: "leucine", display_name: "Leucine", unit: "mg" },
    { key: "lysine", display_name: "Lysine", unit: "mg" },
    { key: "methionine", display_name: "Methionine", unit: "mg" },
    { key: "cystine", display_name: "Cystine", unit: "mg" },
    { key: "phenylalanine", display_name: "Phenylalanine", unit: "mg" },
    { key: "tyrosine", display_name: "Tyrosine", unit: "mg" },
    { key: "valine", display_name: "Valine", unit: "mg" },
    { key: "arginine", display_name: "Arginine", unit: "mg" },
    { key: "histidine", display_name: "Histidine", unit: "mg" },
    { key: "alanine", display_name: "Alanine", unit: "mg" },
    { key: "aspartic_acid", display_name: "Aspartic Acid", unit: "mg" },
    { key: "glutamic_acid", display_name: "Glutamic Acid", unit: "mg" },
    { key: "glycine", display_name: "Glycine", unit: "mg" },
    { key: "proline", display_name: "Proline", unit: "mg" },
    { key: "serine", display_name: "Serine", unit: "mg" },
  ],
};

// Flatten all nutrients for the state
const ALL_NUTRIENTS = [
  ...COMMON_NUTRIENTS,
  ...Object.values(NICHE_NUTRIENTS).flat(),
];

export default function AddIngredientForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [servingUnit, setServingUnit] = useState("g");
  const [servingsPerContainer, setServingsPerContainer] = useState("");
  const [nutrients, setNutrients] = useState(
    ALL_NUTRIENTS.map((nutrient) => ({
      nutrient_key: nutrient.key,
      unit: nutrient.unit,
      amount: 0,
      display_name: nutrient.display_name,
    }))
  );

  const [showNicheNutrients, setShowNicheNutrients] = useState(false);
  const [activeNicheCategory, setActiveNicheCategory] =
    useState<keyof typeof NICHE_NUTRIENTS>("fats");

  const resetForm = () => {
    setName("");
    setBrand("");
    setServingSize("");
    setServingUnit("g");
    setServingsPerContainer("");
    setNutrients(
      ALL_NUTRIENTS.map((nutrient) => ({
        nutrient_key: nutrient.key,
        unit: nutrient.unit,
        amount: 0,
        display_name: nutrient.display_name,
      }))
    );
    setShowNicheNutrients(false);
    setActiveNicheCategory("fats");
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const updateNutrient = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newNutrients = [...nutrients];
    newNutrients[index] = {
      ...newNutrients[index],
      [field]: value,
    };
    setNutrients(newNutrients);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Filter out nutrients with 0 amount
    const nutrientsToSend = nutrients
      .filter((n) => n.amount > 0)
      .map(({ nutrient_key, unit, amount, display_name }) => ({
        nutrient_key,
        unit,
        amount,
        display_name,
      }));

    const res = await fetch("/api/ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        brand,
        serving_size: parseFloat(servingSize),
        serving_unit: servingUnit,
        servings_per_container: servingsPerContainer
          ? parseFloat(servingsPerContainer)
          : null,
        nutrients: nutrientsToSend,
      }),
    });

    const data = await res.json();
    console.log("Insert result:", data);

    if (data.success) {
      // Reset form and close modal on success
      resetForm();
      setIsModalOpen(false);
    }
  }

  // Get common nutrients
  const commonNutrients = nutrients.filter((nutrient) =>
    COMMON_NUTRIENTS.some((common) => common.key === nutrient.nutrient_key)
  );

  // Get niche nutrients for active category
  const activeNicheNutrients = nutrients.filter((nutrient) =>
    NICHE_NUTRIENTS[activeNicheCategory].some(
      (niche) => niche.key === nutrient.nutrient_key
    )
  );

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openModal}
        className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
      >
        Add Ingredient
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Add Ingredient
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Ingredient Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Almond Milk"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      Brand
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Silk"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Serving Size */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                    Serving Size
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Amount *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g., 240"
                        value={servingSize}
                        onChange={(e) => setServingSize(e.target.value)}
                        className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        required
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Unit *
                      </label>
                      <select
                        value={servingUnit}
                        onChange={(e) => setServingUnit(e.target.value)}
                        className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white flex-1"
                      >
                        <option value="g">grams (g)</option>
                        <option value="ml">milliliters (ml)</option>
                        <option value="oz">ounces (oz)</option>
                        <option value="cup">cups</option>
                        <option value="tbsp">tablespoons</option>
                        <option value="tsp">teaspoons</option>
                        <option value="piece">piece</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Servings Per Container
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="e.g., 4"
                        value={servingsPerContainer}
                        onChange={(e) =>
                          setServingsPerContainer(e.target.value)
                        }
                        className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Nutritional Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Nutritional Information (per serving)
                  </h3>

                  {/* Common Nutrients */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium mb-3 text-gray-800 dark:text-gray-200">
                      Common Nutrients
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {commonNutrients.map((nutrient) => {
                        const globalIndex = nutrients.findIndex(
                          (n) => n.nutrient_key === nutrient.nutrient_key
                        );
                        return (
                          <div
                            key={nutrient.nutrient_key}
                            className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            <label className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                              {nutrient.display_name}:
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              placeholder="0"
                              value={nutrient.amount}
                              onChange={(e) =>
                                updateNutrient(
                                  globalIndex,
                                  "amount",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-20 border p-2 rounded text-right dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                            />
                            <span className="w-12 text-sm text-gray-600 dark:text-gray-400">
                              {nutrient.unit}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Niche Nutrients */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">
                        Additional Nutrients
                      </h4>
                      <button
                        type="button"
                        onClick={() =>
                          setShowNicheNutrients(!showNicheNutrients)
                        }
                        className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer"
                      >
                        {showNicheNutrients ? (
                          <>
                            <span>Show Less</span>
                            <span>↑</span>
                          </>
                        ) : (
                          <>
                            <span>Show More Nutrients</span>
                            <span>↓</span>
                          </>
                        )}
                      </button>
                    </div>

                    {showNicheNutrients && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-4">
                        {/* Category Tabs */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {Object.keys(NICHE_NUTRIENTS).map((category) => (
                            <button
                              key={category}
                              type="button"
                              onClick={() =>
                                setActiveNicheCategory(
                                  category as keyof typeof NICHE_NUTRIENTS
                                )
                              }
                              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                                activeNicheCategory === category
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
                              }`}
                            >
                              {category
                                .split("_")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")}
                            </button>
                          ))}
                        </div>

                        {/* Nutrients Grid for Active Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {activeNicheNutrients.map((nutrient) => {
                            const globalIndex = nutrients.findIndex(
                              (n) => n.nutrient_key === nutrient.nutrient_key
                            );
                            return (
                              <div
                                key={nutrient.nutrient_key}
                                className="flex items-center gap-2 p-2 rounded hover:bg-white dark:hover:bg-gray-600"
                              >
                                <label className="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                  {nutrient.display_name}:
                                </label>
                                <input
                                  type="number"
                                  step="0.1"
                                  placeholder="0"
                                  value={nutrient.amount}
                                  onChange={(e) =>
                                    updateNutrient(
                                      globalIndex,
                                      "amount",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="w-20 border p-2 rounded text-right dark:bg-gray-600 dark:border-gray-500 dark:text-white dark:placeholder-gray-400"
                                />
                                <span className="w-12 text-sm text-gray-600 dark:text-gray-400">
                                  {nutrient.unit}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 justify-end pt-4 border-t dark:border-gray-700">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold transition-colors cursor-pointer"
                  >
                    Add Ingredient
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
