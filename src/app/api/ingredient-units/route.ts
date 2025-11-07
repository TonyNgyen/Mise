import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

type Unit = {
  unit_name: string;
  amount: number;
  is_default?: boolean;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ingredient_id, user_id, units } = body;

    const supabase = await createClient();

    // Validate ingredient ownership
    const { data: ingredient, error: ingredientError } = await supabase
      .from("ingredients")
      .select("user_id")
      .eq("id", ingredient_id)
      .single();

    if (ingredientError || !ingredient) throw new Error("Ingredient not found");
    if (ingredient.user_id !== user_id) throw new Error("Unauthorized");

    // Prevent multiple defaults
    const hasMultipleDefaults = units.filter((u:Unit) => u.is_default).length > 1;
    if (hasMultipleDefaults) throw new Error("Only one default unit allowed");

    // Insert units
    const rows = units.map((u:Unit) => ({
      ingredient_id,
      unit_name: u.unit_name,
      amount: u.amount,
      is_default: !!u.is_default,
      created_by: user_id,
    }));

    const { error: insertError } = await supabase.from("ingredient_units").insert(rows);
    if (insertError) throw insertError;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Add units error:", err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
