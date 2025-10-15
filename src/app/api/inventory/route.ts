import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type InsertData = {
  user_id: string; // or number, depending on your schema
  quantity: number;
  unit: string;
  ingredient_id?: string;
  recipe_id?: string;
};

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { ingredient_id, recipe_id, quantity, unit } = body;

//     if ((!ingredient_id && !recipe_id) || (ingredient_id && recipe_id)) {
//       return NextResponse.json(
//         { error: "Must provide either ingredient_id OR recipe_id (not both)" },
//         { status: 400 }
//       );
//     }

//     const supabase = await createClient();

//     // Get user
//     const {
//       data: { user },
//       error: userError,
//     } = await supabase.auth.getUser();
//     if (userError || !user) throw userError || new Error("User not found");

//     // Check if inventory item already exists
//     const { data: existing, error: fetchError } = await supabase
//       .from("inventories")
//       .select("*")
//       .eq("user_id", user.id)
//       .eq(
//         ingredient_id ? "ingredient_id" : "recipe_id",
//         ingredient_id || recipe_id
//       )
//       .maybeSingle();

//     if (fetchError) throw fetchError;

//     let result;

//     if (existing) {
//       // Update existing row → increment quantity
//       const { data, error } = await supabase
//         .from("inventories")
//         .update({
//           quantity: existing.quantity + quantity,
//           unit, // overwrite with latest unit
//         })
//         .eq("id", existing.id)
//         .select()
//         .single();

//       if (error) throw error;
//       result = data;
//     } else {
//       const insertData: InsertData = {
//         user_id: user.id,
//         quantity,
//         unit,
//       };
//       if (ingredient_id) insertData.ingredient_id = ingredient_id;
//       if (recipe_id) insertData.recipe_id = recipe_id;

//       const { data, error } = await supabase
//         .from("inventories")
//         .insert([insertData])
//         .select()
//         .single();

//       if (error) throw error;
//       result = data;
//     }

//     return NextResponse.json({ success: true, inventory: result });
//   } catch (error) {
//     console.error("POST /inventory error:", error);
//     return NextResponse.json({ success: false, error }, { status: 500 });
//   }
// }

// ✅ Get all inventory items for logged-in user

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ingredient_id, recipe_id, quantity, unit } = body;

    const parsedQuantity = parseFloat(quantity);
    if (isNaN(parsedQuantity)) {
      return NextResponse.json(
        { error: "Quantity must be a valid number" },
        { status: 400 }
      );
    }

    // 1. Validation: Must provide one OR the other
    if (!((ingredient_id && !recipe_id) || (recipe_id && !ingredient_id))) {
      return NextResponse.json(
        { error: "Must provide either ingredient_id OR recipe_id (not both)" },
        { status: 400 }
      );
    }

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

    let inventoryError = null;


    if (ingredient_id) {
      ({ error: inventoryError } = await supabase.rpc(
        "update_ingredient_inventory",
        {
          p_ingredient_id: ingredient_id,
          p_quantity_change: parsedQuantity,
          p_unit: unit,
        }
      ));
    } else if (recipe_id) {
      ({ error: inventoryError } = await supabase.rpc(
        "update_recipe_inventory",
        {
          p_recipe_id: recipe_id,
          p_quantity_change: parsedQuantity,
          p_unit: unit,
        }
      ));
    }

    if (inventoryError) {
      console.error("Inventory update error:", inventoryError);
      throw inventoryError;
    }
    return NextResponse.json({
      success: true,
      message: "Inventory updated successfully",
    });
  } catch (error) {
    console.error("POST /inventory error:", error);

    // Provide a more structured error response if possible
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error
    ) {
      errorMessage = (error as { message: string }).message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) throw userError || new Error("User not found");

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
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
