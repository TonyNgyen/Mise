// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Create a contact message
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, category, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("contacts")
      .insert([
        {
          name,
          email,
          category: category || "general",
          message,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, message: data });
  } catch (error) {
    console.error("POST /contact error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Get contact messages (admin only)
export async function GET(req: Request) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated and is admin
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

    // Check if user is admin
    const isAdmin = user.id === process.env.ADMIN_USER_ID;
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";

    let query = supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    // Filter based on status
    if (status === "resolved") {
      query = query.not("resolved_at", "is", null);
    } else if (status === "unresolved") {
      query = query.is("resolved_at", null);
    }
    // "all" returns everything (no filter)

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, messages: data });
  } catch (error) {
    console.error("GET /contact error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Mark message as resolved (admin only)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, resolved } = body;

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

    // Check if user is admin
    const isAdmin = user.id === process.env.ADMIN_USER_ID;
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from("contacts")
      .update({
        resolved_at: resolved ? new Date().toISOString() : null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, message: data });
  } catch (error) {
    console.error("PATCH /contact error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
