import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ingredient_id, recipe_id, quantity, unit } = body;

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) throw userError || new Error("User not found");

    // --- Ingredient path (already implemented elsewhere, leaving as-is) ---
    if (ingredient_id) {
      const { error: ingredientError } = await supabase.rpc(
        "update_ingredient_inventory",
        {
          p_ingredient_id: ingredient_id,
          p_quantity_change: quantity,
          p_unit: unit,
        }
      );
      if (ingredientError) throw ingredientError;
    }

    // --- ✅ Recipe path (new addition) ---
    else if (recipe_id) {
      // Call your SQL function that handles updating all ingredient inventories
      const { error: recipeError } = await supabase.rpc(
        "use_recipe_inventory",
        {
          p_recipe_id: recipe_id,
          p_quantity_change: quantity,
          p_unit: unit,
        }
      );

      if (recipeError) {
        console.error("use_recipe_inventory error:", recipeError);
        throw recipeError;
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Inventory POST error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}

// --- GET: fetch full inventory for logged-in user ---
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

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
          serving_unit,
          units:ingredient_units (
            id,
            unit_name,
            is_default,
            amount
          )
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

    let message = "Unknown error";
    if (error instanceof Error) message = error.message;
    else if (typeof error === "object" && error && "message" in error)
      message = (error as { message: string }).message;

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
