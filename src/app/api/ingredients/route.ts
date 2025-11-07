import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // or your pg client
import { ALL_NUTRIENTS } from "@/constants/constants";

type Unit = {
  unit_name: string;
  amount: number;
  is_default?: boolean;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, name, brand, servings_per_container, nutrients, units } =
      body;

    console.log("Received body:", body);

    const supabase = await createClient();

    const { data: ingredient, error: ingredientError } = await supabase
      .from("ingredients")
      .insert([
        {
          user_id,
          name,
          brand,
          servings_per_container,
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

    if (units?.length) {
      const unitRows = units.map((u: Unit) => ({
        ingredient_id: ingredientId,
        unit_name: u.unit_name,
        amount: u.amount,
        is_default: !!u.is_default,
        created_by: user_id,
      }));

      const { error: unitError } = await supabase
        .from("ingredient_units")
        .insert(unitRows);
      if (unitError) throw unitError;
    }

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
        servings_per_container,
        created_at,
        nutrients:ingredient_nutrients (
          id,
          nutrient_key,
          unit,
          amount
        ),
        units:ingredient_units (
          id,
          unit_name,
          is_default,
          amount
        )
      `
      );

    if (ingredientsError) throw ingredientsError;

    const enrichedIngredients =
      ingredients?.map((ingredient) => ({
        ...ingredient,
        nutrients: ingredient.nutrients.map((n) => {
          const match = ALL_NUTRIENTS.find(
            (nutrient) => nutrient.key === n.nutrient_key
          );
          return {
            ...n,
            display_name: match?.display_name ?? n.nutrient_key,
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
