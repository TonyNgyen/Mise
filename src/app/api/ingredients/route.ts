import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // or your pg client
import { ALL_NUTRIENTS } from "@/constants/constants";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, brand, serving_size, serving_unit, servings_per_container, nutrients } = body;
    console.log("nutrients: ", nutrients);

    const supabase = await createClient();

    // Step 1: Insert into ingredients
    const { data: ingredient, error: ingredientError } = await supabase
      .from("ingredients")
      .insert([
        {
          name,
          brand,
          serving_size,
          serving_unit,
          servings_per_container
        },
      ])
      .select("id")
      .single();

    if (ingredientError) throw ingredientError;
    const ingredientId = ingredient.id;
    const definitionRows = nutrients.map(
      (n: { nutrient_key: string; unit: string; display_name?: string }) => ({
        key: n.nutrient_key,
        unit: n.unit,
        display_name: n.display_name ?? n.nutrient_key,
      })
    );

    const { error: definitionError } = await supabase
      .from("nutrient_definitions")
      .upsert(definitionRows, { onConflict: "key" });

    if (definitionError) throw definitionError;

    // Step 3: Insert into ingredient_nutrients
    const nutrientRows = nutrients.map(
      (n: { nutrient_key: string; unit: string; amount: number }) => ({
        ingredient_id: ingredientId,
        nutrient_key: n.nutrient_key,
        unit: n.unit,
        amount: n.amount,
      })
    );

    const { error: nutrientError } = await supabase
      .from("ingredient_nutrients")
      .insert(nutrientRows);

    if (nutrientError) throw nutrientError;

    return NextResponse.json({ success: true, ingredientId });
  } catch (error) {
    console.error("Insert error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: ingredients, error: ingredientsError } = await supabase
      .from("ingredients")
      .select(
        `
        id,
        name,
        brand,
        serving_size,
        serving_unit,
        servings_per_container,
        created_at,
        nutrients:ingredient_nutrients (
          id,
          nutrient_key,
          unit,
          amount
        )
      `
      );

    if (ingredientsError) throw ingredientsError;

    // Enrich nutrients with display_name from ALL_NUTRIENTS
    const enrichedIngredients =
      ingredients?.map((ingredient) => ({
        ...ingredient,
        nutrients: ingredient.nutrients.map((n) => {
          const match = ALL_NUTRIENTS.find(
            (nutrient) => nutrient.key === n.nutrient_key
          );
          return {
            ...n,
            display_name: match?.display_name ?? n.nutrient_key, // fallback to key
          };
        }),
      })) ?? [];

    return NextResponse.json({
      success: true,
      ingredients: enrichedIngredients,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
