import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type Params = {
  params: { id: string };
};

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { id } = params;

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) throw userError || new Error("User not found");

    const { error } = await supabase
      .from("goals")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /goals error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
