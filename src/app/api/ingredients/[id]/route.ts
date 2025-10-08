import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("ingredients")
      .select("*")
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true, ingredient: data });
  } catch (err) {
    console.error("Error fetching ingredient:", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
