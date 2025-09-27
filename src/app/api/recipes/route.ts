import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, servings, ingredients } = body;

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 1. Insert recipe
    const { data: recipe, error: recipeError } = await supabase
      .from("recipes")
      .insert([{ user_id: user?.id, name, servings }])
      .select("id")
      .single();

    if (recipeError) throw recipeError;

    const recipeId = recipe.id;

    // 2. Insert recipe ingredients
    const ingredientRows = ingredients.map(
      (ing: { ingredient_id: string; quantity: number; unit: string }) => ({
        recipe_id: recipeId,
        ingredient_id: ing.ingredient_id,
        quantity: ing.quantity,
        unit: ing.unit,
      })
    );

    const { error: ingError } = await supabase
      .from("recipe_ingredients")
      .insert(ingredientRows);

    if (ingError) throw ingError;

    return NextResponse.json({ success: true, recipeId });
  } catch (error) {
    console.error("Insert recipe error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: recipes, error } = await supabase
      .from("recipes")
      .select(
        `
        id,
        name,
        servings,
        created_at,
        recipe_nutrients (
          nutrient_key,
          total_amount,
          unit
        ),
        recipe_ingredients (
          quantity,
          unit,
          ingredient:ingredients (
            id,
            name,
            brand,
            serving_size,
            serving_unit
          )
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, recipes });
  } catch (error) {
    console.error("Fetch recipes error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
