import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// ✅ Add or update inventory item
// ✅ Add inventory item (merge if exists)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ingredient_id, recipe_id, quantity, unit } = body;

    if ((!ingredient_id && !recipe_id) || (ingredient_id && recipe_id)) {
      return NextResponse.json(
        { error: "Must provide either ingredient_id OR recipe_id (not both)" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) throw userError || new Error("User not found");

    // Check if inventory item already exists
    const { data: existing, error: fetchError } = await supabase
      .from("inventories")
      .select("*")
      .eq("user_id", user.id)
      .eq(
        ingredient_id ? "ingredient_id" : "recipe_id",
        ingredient_id || recipe_id
      )
      .maybeSingle();

    if (fetchError) throw fetchError;

    let result;

    if (existing) {
      // Update existing row → increment quantity
      const { data, error } = await supabase
        .from("inventories")
        .update({
          quantity: existing.quantity + quantity,
          unit, // overwrite with latest unit
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Insert new row → only set the provided key
      const insertData: any = {
        user_id: user.id,
        quantity,
        unit,
      };
      if (ingredient_id) insertData.ingredient_id = ingredient_id;
      if (recipe_id) insertData.recipe_id = recipe_id;

      const { data, error } = await supabase
        .from("inventories")
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({ success: true, inventory: result });
  } catch (error) {
    console.error("POST /inventory error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

// ✅ Get all inventory items for logged-in user
export async function GET() {
  try {
    const supabase = await createClient();

    // Get user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) throw userError || new Error("User not found");

    // Query inventory and join ingredient/recipe details
    const { data, error } = await supabase
      .from("inventories")
      .select(
        `
        id,
        quantity,
        unit,
        created_at,
        ingredient:ingredient_id (
          id,
          name,
          brand,
          serving_size,
          serving_unit
        ),
        recipe:recipe_id (
          id,
          name,
          servings
        )
      `
      )
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true, inventory: data });
  } catch (error) {
    console.error("GET /inventory error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
