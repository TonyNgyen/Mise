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

    if (ingredient_id) {
      const { data: foodLog, error: logError } = await supabase.rpc(
        "add_ingredient_log",
        {
          p_ingredient_id: ingredient_id,
          p_unit: unit,
          p_amount: quantity,
          p_update_inventory: update_inventory,
          p_log_datetime: logged_at,
        }
      );
      if (logError) throw logError;
    } else if (recipe_id) {
      const { data: foodLog, error: logError } = await supabase.rpc(
        "add_recipe_log",

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

    // return NextResponse.json({ success: true, food_log_id: foodLogId });
    return NextResponse.json({ success: true });
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
      .order("log_datetime", { ascending: false });

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);

      query = query
        .gte("log_datetime", startDate.toISOString())
        .lt("log_datetime", endDate.toISOString());
    }

    const { data: foodLogs, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, food_logs: foodLogs });
  } catch (error) {
    console.error("Get food logs error:", error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
