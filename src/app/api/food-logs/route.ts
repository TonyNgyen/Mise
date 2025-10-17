// app/api/food-logs/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type Nutrient = {
  food_log_id: string;
  nutrient_key: string;
  amount: number;
  unit: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      ingredient_id,
      recipe_id,
      quantity,
      unit,
      logged_at,
      update_inventory,
    } = body;

    const supabase = await createClient();

    // Validate that either ingredient_id or recipe_id is provided
    if (!ingredient_id && !recipe_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Either ingredient_id or recipe_id is required",
        },
        { status: 400 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) throw userError || new Error("User not found");

    // Start a transaction
    const { data: foodLog, error: logError } = await supabase
      .from("food_logs")
      .insert([
        {
          user_id: user.id,
          ingredient_id: ingredient_id || null,
          recipe_id: recipe_id || null,
          quantity: parseFloat(quantity),
          unit,
          logged_at: logged_at || new Date().toISOString(),
          update_inventory: Boolean(update_inventory),
        },
      ])
      .select("id")
      .single();

    if (logError) throw logError;

    const foodLogId = foodLog.id;

    // Calculate nutrients based on whether it's an ingredient or recipe
    let nutrients: Nutrient[] = [];

    if (ingredient_id) {
      // Get ingredient nutrients
      const { data: ingredientNutrients } = await supabase
        .from("ingredient_nutrients")
        .select("nutrient_key, amount, unit")
        .eq("ingredient_id", ingredient_id);

      const { data: ingredientInfo } = await supabase
        .from("ingredients")
        .select("serving_size, serving_unit")
        .eq("id", ingredient_id)
        .single();

      if (ingredientNutrients && ingredientInfo) {
        nutrients = ingredientNutrients.map((nutrient) => ({
          food_log_id: foodLogId,
          nutrient_key: nutrient.nutrient_key,
          amount:
            nutrient.amount *
            (parseFloat(quantity) / ingredientInfo.serving_size), // Assuming nutrients are per 100g
          unit: nutrient.unit,
        }));
      }
    } else if (recipe_id) {
      const { data: recipeNutrients, error: recipeError } = await supabase
        .from("recipe_nutrients")
        .select("*")
        .eq("recipe_id", recipe_id);

      const { data: recipeInfo } = await supabase
        .from("recipes")
        .select("servings")
        .eq("id", recipe_id)
        .single();

      console.log("Recipe Nutrients:", recipeNutrients, "Error:", recipeError);

      if (recipeNutrients) {
        nutrients = recipeNutrients.map((nutrient) => ({
          food_log_id: foodLogId,
          nutrient_key: nutrient.nutrient_key,
          amount:
            nutrient.total_amount *
            (parseFloat(quantity) / recipeInfo?.servings),
          unit: nutrient.unit,
        }));
      }
    }

    if (nutrients.length > 0) {
      const { error: nutrientError } = await supabase
        .from("food_log_nutrients")
        .insert(nutrients);

      if (nutrientError) throw nutrientError;
    }

    if (update_inventory) {
      if (ingredient_id) {
        const { error: inventoryError } = await supabase.rpc(
          "update_ingredient_inventory",
          {
            p_ingredient_id: ingredient_id,
            p_quantity_change: -parseFloat(quantity),
            p_unit: unit,
          }
        );

        if (inventoryError) {
          console.log(inventoryError);
          throw inventoryError;
        }
      } else if (recipe_id) {
        const { error: inventoryError } = await supabase.rpc(
          "update_recipe_inventory",
          {
            p_recipe_id: recipe_id,
            p_quantity_change: -parseFloat(quantity),
            p_unit: unit,
          }
        );

        if (inventoryError) throw inventoryError;
      }
    }

    return NextResponse.json({ success: true, food_log_id: foodLogId });
  } catch (error) {
    console.error("Food log error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}

// Get food logs
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    const supabase = await createClient();

    let query = supabase
      .from("food_logs")
      .select(
        `
        *,
        ingredient:ingredients(*),
        recipe:recipes(*),
        nutrients:food_log_nutrients(*)
      `
      )
      .order("logged_at", { ascending: false });

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      query = query
        .gte("logged_at", startDate.toISOString())
        .lt("logged_at", endDate.toISOString());
    }

    const { data: foodLogs, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, food_logs: foodLogs });
  } catch (error) {
    console.error("Get food logs error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
