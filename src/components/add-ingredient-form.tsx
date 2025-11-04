"use client";

import { useState, useMemo } from "react";
import {
  LuPlus,
  LuX,
  LuChevronDown,
  LuChevronUp,
  LuTrash2,
  LuInfo,
  LuTriangleAlert, // Added for error icon
} from "react-icons/lu"; // Using lucide-react for icons

// Type definitions for clarity
type Nutrient = {
  key: string;
  display_name: string;
  unit: string;
};

type NicheNutrientCategory = {
  [key: string]: Nutrient[];
};

type NutrientState = {
  nutrient_key: string;
  unit: string;
  amount: number | string; // Use string for input to allow partial/decimal entry
  display_name: string;
};

type UnitConversion = {
  unit_name: string;
  amount: number | string; // Use string for input
  is_default: boolean;
};

// --- Data Definitions (Unchanged) ---
const COMMON_NUTRIENTS: Nutrient[] = [
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

const NICHE_NUTRIENTS: NicheNutrientCategory = {
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
    { key: "copper", display_name: "Copper", unit: "mg" }, // Fixed typo "Cupper" -> "Copper" for display
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

const ALL_NUTRIENTS = [
  ...COMMON_NUTRIENTS,
  ...Object.values(NICHE_NUTRIENTS).flat(),
];

const STANDARD_UNITS = [
  "g",
  "ml",
  "oz",
  "cup",
  "tbsp",
  "tsp",
  "piece",
  "serving",
];

const Tooltip = ({
  content,
  children,
}: {
  content: string;
  children: React.ReactNode;
}) => (
  <div className="relative flex items-center group">
    {children}
    <span
      className="absolute left-1/2 -top-10 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-200 origin-bottom 
					 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 text-xs rounded py-1 px-2 z-50 whitespace-nowrap shadow-lg"
    >
      {content}
    </span>
  </div>
);

export default function AddIngredientForm({
  user_id,
  fetchIngredients,
}: {
  user_id: string;
  fetchIngredients: () => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [servingSize, setServingSize] = useState<string>("");
  const [servingUnit, setServingUnit] = useState<string>("g");
  const [servingsPerContainer, setServingsPerContainer] = useState("");
  const [nutrients, setNutrients] = useState<NutrientState[]>(() =>
    ALL_NUTRIENTS.map((nutrient) => ({
      nutrient_key: nutrient.key,
      unit: nutrient.unit,
      amount: "",
      display_name: nutrient.display_name,
    }))
  );
  const [units, setUnits] = useState<UnitConversion[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const [showNicheNutrients, setShowNicheNutrients] = useState(false);
  const [activeNicheCategory, setActiveNicheCategory] =
    useState<keyof typeof NICHE_NUTRIENTS>("fats");

  const commonNutrients = useMemo(
    () =>
      nutrients.filter((nutrient) =>
        COMMON_NUTRIENTS.some((common) => common.key === nutrient.nutrient_key)
      ),
    [nutrients]
  );

  const activeNicheNutrients = useMemo(
    () =>
      nutrients.filter((nutrient) =>
        NICHE_NUTRIENTS[activeNicheCategory].some(
          (niche) => niche.key === nutrient.nutrient_key
        )
      ),
    [nutrients, activeNicheCategory]
  );

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
        amount: "",
        display_name: nutrient.display_name,
      }))
    );
    setUnits([]);
    setShowNicheNutrients(false);
    setActiveNicheCategory("fats");
    setFormError(null);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const updateNutrient = (
    index: number,
    value: string
  ) => {
    const newNutrients = [...nutrients];
    const amount = value === "" ? "" : parseFloat(value);

    newNutrients[index] = {
      ...newNutrients[index],
      amount: isNaN(amount as number) ? value : amount,
    };
    setNutrients(newNutrients);
  };

  const addUnit = () => {
    setUnits([
      ...units,
      { unit_name: "", amount: "", is_default: false },
    ]);
  };

  const updateUnit = (
    index: number,
    field: "unit_name" | "amount" | "is_default",
    value: string | number | boolean
  ) => {
    const updated = [...units];
    let processedValue: string | number | boolean = value;

    if (field === "amount") {

      processedValue = value;
    }

    updated[index] = { ...updated[index], [field]: processedValue };

    if (field === "is_default" && value === true) {
      updated.forEach((u, i) => {
        if (i !== index) u.is_default = false;
      });
    }

    // NEW: If a unit name is added/changed, and no unit is currently default,
    // and there's no serving size, you might want to auto-select.
    // However, it's safer to do the auto-selection on submit, as it's a final
    // validation/auto-fill step. We'll keep the submit logic cleaner.

    setUnits(updated);
  };

  const unitsForDisplay = useMemo(() => {
    // 1. Filter out invalid units (same logic as used in handleSubmit pre-validation)
    let processedUnits = units
      .map((u) => ({
        ...u,
        amount: parseFloat(u.amount as string) || 0,
      }))
      .filter((u) => u.unit_name.trim() !== "" && u.amount > 0);

    // 2. Check current conditions for auto-default
    const isServingInfoComplete =
      servingSize.trim() !== "" && parseFloat(servingSize) > 0;
    const hasDefaultUnit = processedUnits.some((u) => u.is_default);

    if (
      !isServingInfoComplete &&
      processedUnits.length > 0 &&
      !hasDefaultUnit
    ) {
      // Auto-select the first valid unit if Section 2 is empty and no custom default exists
      processedUnits = processedUnits.map((u, i) => ({
        ...u,
        // Use the original boolean if one was manually checked, otherwise default to the first
        is_default: units[i]?.is_default || i === 0,
      }));
    } else if (isServingInfoComplete && hasDefaultUnit) {
      // OPTIONAL: If Section 2 IS filled, and a custom default exists,
      // you might want to clear the custom default to avoid confusion,
      // but for now, we'll let the user choose the default unless they
      // clear Section 2.
    }

    // 3. Re-map back to the original structure for rendering (using the modified is_default)
    return units.map((u, i) => {
      // Find the corresponding unit in the processed list (if it still exists)
      const processedUnit = processedUnits.find(
        (pu) =>
          pu.unit_name === u.unit_name &&
          (u.amount === "" || pu.amount === parseFloat(u.amount as string))
      );

      return {
        ...u,
        // Use the auto-updated default status, but fall back to the original for units
        // that might have been filtered out (though filtering on valid units is better UX)
        is_default: processedUnit ? processedUnit.is_default : u.is_default,
      };
    });
  }, [units, servingSize]); // Recalculate whenever units or servingSize changes

  const removeUnit = (index: number) => {
    setUnits(units.filter((_, i) => i !== index));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null); // Clear previous errors // 1. Finalize Units to Send // Create a working copy of units state for modification and validation

    let workingUnits = units
      .map((u) => ({
        ...u,
        amount: parseFloat(u.amount as string) || 0,
      }))
      .filter((u) => u.unit_name.trim() !== "" && u.amount > 0); // 2. Validate Serving Information

    const isServingInfoComplete =
      servingSize.trim() !== "" && parseFloat(servingSize) > 0;

    // 3. AUTO-DEFAULT UNIT LOGIC (The requested feature for the payload)
    const hasCustomUnits = workingUnits.length > 0;
    const hasDefaultUnit = workingUnits.some((u) => u.is_default);

    if (isServingInfoComplete) {
      if (hasDefaultUnit) {
        workingUnits.push({
          unit_name: servingUnit,
          amount: parseFloat(servingSize),
          is_default: false,
        });
      } else {
        workingUnits.push({
          unit_name: servingUnit,
          amount: parseFloat(servingSize),
          is_default: true,
        });
      }
    }

    if (!isServingInfoComplete && hasCustomUnits && !hasDefaultUnit) {
      // Automatically set the first valid custom unit as the default for the PAYLOAD
      workingUnits = workingUnits.map((u, i) => ({
        ...u,
        is_default: i === 0,
      }));
    }

    const finalUnitsToSend = workingUnits;

    // 4. Conditional Validation Logic
    if (!isServingInfoComplete && finalUnitsToSend.length === 0) {
      setFormError(
        "You must define either the **Serving Information (Section 2)** OR at least one **Custom Unit Conversion (Section 3)** before saving."
      );
      return; // Stop submission
    }

    const nutrientsToSend = nutrients
      .map((n) => ({
        ...n,
        amount: parseFloat(n.amount as string) || 0, // Ensure final conversion for backend
      }))
      .filter((n) => n.amount > 0)
      .map(({ nutrient_key, unit, amount, display_name }) => ({
        nutrient_key,
        unit,
        amount,
        display_name,
      })); // 6. Prepare Payload

    const payload = {
      user_id,
      name,
      brand, // Pass serving size only if it's filled, otherwise use 0 or null
      serving_size: isServingInfoComplete ? parseFloat(servingSize) : null,
      serving_unit: isServingInfoComplete ? servingUnit : null, // Only send unit if size is present
      servings_per_container: servingsPerContainer
        ? parseFloat(servingsPerContainer)
        : null,
      nutrients: nutrientsToSend,
      units: finalUnitsToSend, // Use the finalized array
    };

    const res = await fetch("/api/ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      resetForm();
      setIsModalOpen(false);
      alert("Ingredient added successfully! 🎉");
      fetchIngredients(); // Refresh the ingredient list after adding a new one
    } else {
      alert("Failed to add ingredient. Please try again.");
    }
  }

  // Helper to format category title
  const formatCategoryTitle = (key: string) =>
    key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={openModal}
        className="cursor-pointer flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-md transition-all duration-200 ease-in-out transform hover:scale-[1.01]"
      >
        <LuPlus size={20} />
        Add New Ingredient
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 dark:bg-black/90 flex items-center justify-center p-4 sm:p-8 z-[100]">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col transition-all duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Add New Ingredient
              </h2>
              <button
                onClick={closeModal}
                className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close modal"
              >
                <LuX size={24} />
              </button>
            </div>

            {/* Modal Content - Scrollable Form */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                {/* NEW: Error Message Display */}
                {formError && (
                  <div
                    className="flex items-center gap-3 p-4 bg-red-100 border border-red-400 text-red-700 dark:bg-red-950 dark:border-red-700 dark:text-red-300 rounded-xl"
                    role="alert"
                  >
                    <LuTriangleAlert size={20} className="flex-shrink-0" />
                    <p
                      className="text-sm font-medium"
                      dangerouslySetInnerHTML={{ __html: formError }}
                    ></p>
                  </div>
                )}
                {/* --- Section: Basic Information --- */}
                <section>
                  <h3 className="text-xl font-bold mb-4 text-indigo-600 dark:text-indigo-400 border-b border-indigo-100 dark:border-gray-700 pb-2">
                    1. Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300"
                      >
                        Ingredient Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="e.g., Almond Milk (Unsweetened)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="brand"
                        className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300"
                      >
                        Brand
                      </label>
                      <input
                        id="brand"
                        type="text"
                        placeholder="e.g., Silk, Trader Joe's"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                  </div>
                </section>

                {/* --- Section: Serving Size & Packaging --- */}
                <section>
                  <h3 className="text-xl flex gap-2 font-bold mb-4 text-indigo-600 dark:text-indigo-400 border-b border-indigo-100 dark:border-gray-700 pb-2">
                    2. Serving Information{" "}
                    <Tooltip content="This is optional if Custom Units are used in Section 3.">
                      <LuInfo
                        size={14}
                        className="text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors cursor-help"
                      />
                    </Tooltip>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label
                        htmlFor="servingSize"
                        className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300"
                      >
                        Serving Amount (for nutritional label)
                      </label>
                      <input
                        id="servingSize"
                        type="number"
                        step="0.1"
                        placeholder="e.g., 100 or 240"
                        value={servingSize}
                        onChange={(e) => setServingSize(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                        // Removed 'required' attribute
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="servingUnit"
                        className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300"
                      >
                        Serving Unit
                      </label>
                      <select
                        id="servingUnit"
                        value={servingUnit}
                        onChange={(e) => setServingUnit(e.target.value)}
                        className="w-full border border-gray-300 p-3 rounded-xl appearance-none pr-10 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        // Removed 'required' attribute
                      >
                        {STANDARD_UNITS.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="servingsPerContainer"
                        className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300"
                      >
                        Servings Per Container
                      </label>
                      <input
                        id="servingsPerContainer"
                        type="number"
                        step="0.1"
                        placeholder="e.g., 4"
                        value={servingsPerContainer}
                        onChange={(e) =>
                          setServingsPerContainer(e.target.value)
                        }
                        className="w-full border border-gray-300 p-3 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                    </div>
                  </div>
                </section>

                {/* --- Section: Units & Conversions (Collapsible/Dynamic) --- */}
                <section>
                  <h3 className="text-xl font-bold mb-4 text-indigo-600 dark:text-indigo-400 border-b border-indigo-100 dark:border-gray-700 pb-2 flex items-center gap-2">
                    3. Custom Unit Conversions{" "}
                    <Tooltip content="This is optional if Serving Information is provided in Section 2.">
                      <LuInfo
                        size={14}
                        className="text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors cursor-help"
                      />
                    </Tooltip>
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Define custom units (e.g., "scoop", "slice")
                  </p>
                  <div className="">
                    {unitsForDisplay.map((unit, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-750"
                      >
                        <div className="col-span-1">
                          <div className="flex items-center border border-gray-300 p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600">
                            <input
                              type="number"
                              step="0.1"
                              placeholder="Amount"
                              value={unit.amount}
                              onChange={(e) =>
                                updateUnit(i, "amount", e.target.value)
                              }
                              className="w-full bg-transparent focus:outline-none dark:text-white text-left"
                              required
                            />
                          </div>
                        </div>
                        <input
                          type="text"
                          placeholder="Unit Name (e.g., scoop)"
                          value={unit.unit_name}
                          onChange={(e) =>
                            updateUnit(i, "unit_name", e.target.value)
                          }
                          className="border border-gray-300 p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          required
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={unit.is_default} // Now reflects the calculated default
                            onChange={(e) =>
                              updateUnit(i, "is_default", e.target.checked)
                            }
                            className="form-checkbox cursor-pointer h-4 w-4 text-indigo-600 rounded border-gray-300 dark:bg-gray-600 dark:border-gray-500 focus:ring-indigo-500"
                          />{" "}
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Default Unit
                            <Tooltip content="This unit will be the default display unit when tracking meals.">
                              <LuInfo
                                size={14}
                                className="text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors cursor-help"
                              />
                            </Tooltip>
                          </label>
                        </div>

                        <div className="flex justify-end items-center">
                          <button
                            type="button"
                            onClick={() => removeUnit(i)}
                            className=" text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 rounded transition-colors cursor-pointer"
                            aria-label="Remove unit"
                          >
                            <LuTrash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addUnit}
                    className="cursor-pointer mt-3 flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-semibold transition-colors"
                  >
                    <LuPlus size={16} />
                    Add Custom Unit
                  </button>
                </section>

                {/* --- Section: Nutritional Information --- */}
                <section>
                  <h3 className="text-xl font-bold mb-4 text-indigo-600 dark:text-indigo-400 border-b border-indigo-100 dark:border-gray-700 pb-2">
                    4. Nutritional Information (Per Serving)
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Enter the amount of each nutrient for the defined serving
                    size. Leave fields blank or '0' if the nutrient is not
                    present.
                  </p>

                  {/* Common Nutrients */}
                  <div className="mb-6 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                    <h4 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">
                      Nutrients
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                      {commonNutrients.map((nutrient, index) => {
                        const globalIndex = nutrients.findIndex(
                          (n) => n.nutrient_key === nutrient.nutrient_key
                        );
                        return (
                          <div
                            key={nutrient.nutrient_key}
                            className="flex items-center justify-between gap-2"
                          >
                            <label className="flex-1 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap overflow-hidden text-ellipsis mr-2">
                              {nutrient.display_name}
                            </label>
                            <div className="flex items-center">
                              <input
                                type="text" // Use text to allow for empty string
                                inputMode="decimal"
                                step="0.1"
                                placeholder="0"
                                value={nutrient.amount}
                                onChange={(e) =>
                                  updateNutrient(globalIndex, e.target.value)
                                }
                                className="w-20 border border-gray-300 p-2 rounded-l-lg text-right dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 text-sm"
                              />
                              <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600 w-12 text-center">
                                {nutrient.unit}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Niche Nutrients - Collapsible Section */}
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setShowNicheNutrients(!showNicheNutrients)}
                      className="cursor-pointer w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-lg font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <span>
                        Additional Nutrients
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                          ({ALL_NUTRIENTS.length - COMMON_NUTRIENTS.length}{" "}
                          total)
                        </span>
                      </span>
                      {showNicheNutrients ? (
                        <LuChevronUp size={20} className="text-indigo-600" />
                      ) : (
                        <LuChevronDown size={20} className="text-indigo-600" />
                      )}
                    </button>

                    {showNicheNutrients && (
                      <div className="bg-gray-50 dark:bg-gray-750 rounded-b-xl p-4 transition-all duration-300 border border-t-0 border-gray-200 dark:border-gray-700">
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
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                                activeNicheCategory === category
                                  ? "bg-indigo-600 text-white shadow-md"
                                  : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 cursor-pointer"
                              }`}
                            >
                              {formatCategoryTitle(category)}
                            </button>
                          ))}
                        </div>

                        {/* Nutrients Grid for Active Category */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 pt-2">
                          {activeNicheNutrients.map((nutrient) => {
                            const globalIndex = nutrients.findIndex(
                              (n) => n.nutrient_key === nutrient.nutrient_key
                            );
                            return (
                              <div
                                key={nutrient.nutrient_key}
                                className="flex items-center justify-between gap-2"
                              >
                                <label className="flex-1 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap overflow-hidden text-ellipsis mr-2">
                                  {nutrient.display_name}
                                </label>
                                <div className="flex items-center">
                                  <input
                                    type="text"
                                    inputMode="decimal"
                                    step="0.1"
                                    placeholder="0"
                                    value={nutrient.amount}
                                    onChange={(e) =>
                                      updateNutrient(
                                        globalIndex,
                                        e.target.value
                                      )
                                    }
                                    className="w-20 border border-gray-300 p-2 rounded-l-lg text-right dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 text-sm"
                                  />
                                  <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600 w-12 text-center">
                                    {nutrient.unit}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* --- Form Actions --- */}
                <div className="flex gap-4 justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="cursor-pointer px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold transition-colors shadow-md shadow-indigo-500/30 dark:shadow-indigo-500/20"
                  >
                    Save Ingredient
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
