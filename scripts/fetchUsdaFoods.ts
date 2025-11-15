import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const API_KEY = process.env.USDA_API_KEY;
const SEARCH_URL = "https://api.nal.usda.gov/fdc/v1/foods/search";
const FOOD_URL = "https://api.nal.usda.gov/fdc/v1/food";

const popularFoods = [
  "apple",
  "banana",
  "orange",
  "strawberry",
  "blueberry",
  "raspberry",
  "grape",
  "watermelon",
  "cantaloupe",
  "honeydew",
  "pineapple",
  "mango",
  "peach",
  "pear",
  "plum",
  "cherry",
  "avocado",
  "lemon",
  "lime",
  "grapefruit",
  "kiwi",
  "pomegranate",
  "papaya",
  "fig",
  "date",
  "coconut",
  "blackberry",

  "carrot",
  "potato",
  "sweet potato",
  "tomato",
  "cucumber",
  "lettuce",
  "spinach",
  "kale",
  "broccoli",
  "cauliflower",
  "cabbage",
  "bell pepper",
  "onion",
  "garlic",
  "mushroom",
  "zucchini",
  "eggplant",
  "celery",
  "asparagus",
  "green beans",
  "peas",
  "corn",
  "beet",
  "radish",
  "ginger",

  "chicken breast",
  "chicken thigh",
  "chicken wing",
  "ground beef",
  "steak",
  "ribeye",
  "sirloin",
  "pork chop",
  "pork loin",
  "ground pork",
  "bacon",
  "sausage",
  "turkey breast",
  "ham",
  "lamb chop",
  "lamb leg",

  "salmon",
  "tuna",
  "tilapia",
  "cod",
  "shrimp",
  "crab",
  "lobster",
  "scallop",
  "sardine",
  "anchovy",
  "trout",
  "halibut",
  "mussels",
  "clams",
  "oysters",

  "milk",
  "whole milk",
  "2% milk",
  "skim milk",
  "yogurt",
  "greek yogurt",
  "butter",
  "cheese",
  "cheddar cheese",
  "mozzarella cheese",
  "parmesan cheese",
  "cottage cheese",
  "cream cheese",
  "sour cream",
  "heavy cream",

  "egg",
  "egg white",
  "egg yolk",

  "rice",
  "white rice",
  "brown rice",
  "oatmeal",
  "quinoa",
  "barley",
  "couscous",
  "wheat flour",
  "pasta",
  "spaghetti",
  "macaroni",
  "ramen",
  "bread",
  "white bread",
  "whole wheat bread",
  "tortilla",
  "bagel",

  "black beans",
  "pinto beans",
  "kidney beans",
  "chickpeas",
  "lentils",
  "edamame",
  "soybeans",
  "split peas",

  "almonds",
  "peanuts",
  "cashews",
  "walnuts",
  "pecans",
  "pistachios",
  "sunflower seeds",
  "pumpkin seeds",
  "chia seeds",
  "flax seeds",

  "olive oil",
  "vegetable oil",
  "canola oil",
  "avocado oil",
  "butter",
  "ghee",
  "lard",
  "margarine",

  "chocolate",
  "dark chocolate",
  "candy",
  "gummy bears",
  "chips",
  "potato chips",
  "tortilla chips",
  "popcorn",
  "pretzels",
  "crackers",
  "cookies",
  "brownies",
  "ice cream",
  "granola bar",
  "protein bar",

  "water",
  "soda",
  "cola",
  "diet soda",
  "coffee",
  "tea",
  "orange juice",
  "apple juice",
  "lemonade",
  "sports drink",
  "energy drink",
  "milkshake",
  "smoothie",

  "ketchup",
  "mustard",
  "mayonnaise",
  "ranch dressing",
  "Caesar dressing",
  "balsamic vinegar",
  "soy sauce",
  "fish sauce",
  "hot sauce",
  "bbq sauce",
  "salsa",
  "hummus",
  "peanut butter",
  "almond butter",
  "jam",
  "jelly",
  "honey",
  "maple syrup",
  "pesto",
  "marinara sauce",

  "basil",
  "parsley",
  "cilantro",
  "rosemary",
  "thyme",
  "oregano",
  "dill",
  "cinnamon",
  "nutmeg",
  "cumin",
  "paprika",
  "chili powder",
  "turmeric",
  "black pepper",
  "salt",
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
  foodNutrients: Nutrient[];
}

interface SearchResponse {
  foods: SearchResult[];
}

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
  )}&api_key=${API_KEY}&pageSize=5&dataType=Foundation`;
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
  const resJson = (await res.json()) as FoodDetail;
  return resJson as FoodDetail;
}

async function main() {
  const start = performance.now();
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

      for (const n of s.foodNutrients || []) {
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
        servingSize:
          details.servingSize || details.foodPortions?.[0].gramWeight || null,
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
  console.log(results);

  fs.writeFileSync("usda_foods_full.json", JSON.stringify(results, null, 2));
  console.log("✅ Saved to usda_foods_full.json");
  const end = performance.now();
  const totalMs = end - start;

  console.log(`⏱️ Total time: ${(totalMs / 1000).toFixed(2)} seconds`);
}

main().catch(console.error);
