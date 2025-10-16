// app/api/ingredients/search/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const supabase = await createClient();

  const { data, error } = await supabase
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
    )
    .ilike("name", `%${q}%`)
    .limit(10);

  if (error) {
    console.error("Ingredient search error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }

  return NextResponse.json({ success: true, ingredients: data });
}
