import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const API_KEY =
  process.env.USDA_API_KEY;
const SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";
const FOOD_URL = "https://api.nal.usda.gov/fdc/v1/food";

const popularFoods = [
  "apple",
  "banana",
  "chicken breast",
  "rice",
  "egg",
  "milk",
  "bread",
  "beef",
  "potato",
  "broccoli",
];

// --- Interfaces ---
interface Nutrient {
  nutrientName: string;
  value: number;
  unitName: string;
}

interface Measure {
  measureUnitAbbreviation?: string;
  measureUnitName?: string;
  modifier?: string;
  gramWeight?: number;
  value?: number;
}

interface FoodDetail {
  description: string;
  foodNutrients: Nutrient[];
  servingSize?: number;
  servingSizeUnit?: string;
  householdServingFullText?: string;
  foodPortions?: Measure[];
}

interface SearchResult {
  fdcId: number;
  description: string;
}

interface SearchResponse {
  foods: SearchResult[];
}

// --- Nutrient Mapping ---
const NUTRIENT_MAP: Record<string, string> = {
  Energy: "calories",
  "Energy (Atwater General Factors)": "calories",
  "Energy (Atwater Specific Factors)": "calories_alt",
  Protein: "protein",
  "Total lipid (fat)": "total_fat",
  "Fatty acids, total saturated": "saturated_fat",
  "Fatty acids, total trans": "trans_fat",
  "Carbohydrate, by difference": "carbohydrates_alt",
  "Carbohydrate, by summation": "carbohydrates",
  "Fiber, total dietary": "dietary_fiber",
  "Sugars, total including NLEA": "sugars",
  "Sugars, total": "sugars",
  "Sugars, added": "added_sugars",
  Cholesterol: "cholesterol",
  "Sodium, Na": "sodium",
  "Potassium, K": "potassium",
  "Vitamin D (D2 + D3)": "vitamin_d",
  "Calcium, Ca": "calcium",
  "Iron, Fe": "iron",
  "Vitamin A, RAE": "vitamin_a",
  "Vitamin C, total ascorbic acid": "vitamin_c",
  "Fatty acids, total polyunsaturated": "polyunsaturated_fat",
  "Fatty acids, total monounsaturated": "monounsaturated_fat",
  "Fiber, soluble": "soluble_fiber",
  "Fiber, insoluble": "insoluble_fiber",
  "Sugar alcohol": "sugar_alcohols",
  "Vitamin E (alpha-tocopherol)": "vitamin_e",
  "Vitamin K (phylloquinone)": "vitamin_k",
  Thiamin: "thiamin",
  Riboflavin: "riboflavin",
  Niacin: "niacin",
  "Vitamin B-6": "vitamin_b6",
  "Folate, total": "folate",
  "Vitamin B-12": "vitamin_b12",
  Biotin: "biotin",
  "Pantothenic acid": "pantothenic_acid",
  "Phosphorus, P": "phosphorus",
  "Iodine, I": "iodine",
  "Magnesium, Mg": "magnesium",
  "Zinc, Zn": "zinc",
  "Selenium, Se": "selenium",
  "Copper, Cu": "copper",
  "Manganese, Mn": "manganese",
  "Chromium, Cr": "chromium",
  "Molybdenum, Mo": "molybdenum",
  Chloride: "chloride",
  Tryptophan: "tryptophan",
  Threonine: "threonine",
  Isoleucine: "isoleucine",
  Leucine: "leucine",
  Lysine: "lysine",
  Methionine: "methionine",
  Cystine: "cystine",
  Phenylalanine: "phenylalanine",
  Tyrosine: "tyrosine",
  Valine: "valine",
  Arginine: "arginine",
  Histidine: "histidine",
  Alanine: "alanine",
  "Aspartic acid": "aspartic_acid",
  "Glutamic acid": "glutamic_acid",
  Glycine: "glycine",
  Proline: "proline",
  Serine: "serine",
};

// --- Fetch functions ---
async function searchFood(foodName: string): Promise<SearchResult[]> {
  const url = `${SEARCH_URL}?query=${encodeURIComponent(
    foodName
  )}&api_key=${API_KEY}&pageSize=3&dataType=Foundation`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`❌ Search failed for ${foodName}: ${res.statusText}`);
    return [];
  }
  const data = (await res.json()) as SearchResponse;
  return data.foods || [];
}

async function getFoodDetails(fdcId: number): Promise<FoodDetail | null> {
  const url = `${FOOD_URL}/${fdcId}?api_key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`❌ Detail fetch failed for ID ${fdcId}: ${res.statusText}`);
    return null;
  }
  return (await res.json()) as FoodDetail;
}

// --- Main ---
async function main() {
  const results: Record<string, any[]> = {};

  for (const food of popularFoods) {
    console.log(`🔍 Searching: ${food}`);
    const searchResults = await searchFood(food);
    if (!searchResults.length) continue;

    const detailedFoods: any[] = [];
    for (const s of searchResults) {
      const details = await getFoodDetails(s.fdcId);
      if (!details) continue;

      const matchedNutrients: Record<string, { value: number; unit: string }> =
        {};

      for (const n of details.foodNutrients || []) {
        const mappedKey = NUTRIENT_MAP[n.nutrientName];
        if (mappedKey) {
          matchedNutrients[mappedKey] = {
            value: n.value,
            unit: n.unitName,
          };
        }
      }

      detailedFoods.push({
        name: details.description,
        servingSize: details.servingSize || null,
        servingSizeUnit: details.servingSizeUnit || null,
        householdServing: details.householdServingFullText || null,
        measures: details.foodPortions?.map((p) => ({
          unit: p.measureUnitName || p.modifier,
          gramWeight: p.gramWeight,
          value: p.value,
        })),
        nutrients: matchedNutrients,
      });
    }

    results[food] = detailedFoods;
  }

  // fs.writeFileSync("usda_foods_full.json", JSON.stringify(results, null, 2));
  // console.log("✅ Saved to usda_foods_full.json");
}

main().catch(console.error);
