// app/api/goals/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Create a goal
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nutrient_key, target_amount } = body;

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) throw userError || new Error("User not found");

    const { data, error } = await supabase
      .from("goals")
      .insert([
        {
          user_id: user.id,
          nutrient_key,
          target_amount,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, goal: data });
  } catch (error) {
    console.error("POST /goals error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

// Get all goals for current user
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) throw userError || new Error("User not found");

    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, goals: data });
  } catch (error) {
    console.error("GET /goals error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

// Update a goal
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, target_amount } = body;

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) throw userError || new Error("User not found");

    const { data, error } = await supabase
      .from("goals")
      .update({
        target_amount,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, goal: data });
  } catch (error) {
    console.error("PUT /goals error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

// Delete a goal

