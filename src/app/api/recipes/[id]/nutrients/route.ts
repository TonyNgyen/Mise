import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ await params
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("recipe_nutrients")
      .select("*")
      .eq("recipe_id", id);

    if (error) throw error;

    return NextResponse.json({ success: true, nutrients: data });
  } catch (err) {
    console.error("Error fetching recipe nutrients:", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
