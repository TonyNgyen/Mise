import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .ilike("name", `%${q}%`)
    .limit(10);

  if (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }

  return NextResponse.json({ success: true, results: data });
}
