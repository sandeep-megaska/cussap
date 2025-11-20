import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";

// GET: list registrations (for admin dashboard)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("edtech_registrations")
      .select(
        "id, created_at, parent_name, parent_email, phone, children_count, children_info, notes"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching registrations:", error);
      return NextResponse.json(
        { error: "Failed to load registrations" },
        { status: 500 }
      );
    }

    return NextResponse.json({ registrations: data ?? [] });
  } catch (err: any) {
    console.error("Error in /api/registrations GET:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// POST: create registration, but prevent duplicate parent_email
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      parentName,
      parentEmail,
      phone,
      childrenCount,
      childrenInfo,
      notes,
    } = body as {
      parentName: string;
      parentEmail: string;
      phone?: string;
      childrenCount?: number;
      childrenInfo?: string;
      notes?: string;
    };

    if (!parentName || !parentEmail) {
      return NextResponse.json(
        { error: "Parent name and email are required" },
        { status: 400 }
      );
    }

    const cleanName = parentName.trim();
    const cleanEmail = parentEmail.trim().toLowerCase();
    const cleanPhone = phone?.trim() || null;
    const cleanChildrenInfo = childrenInfo?.trim() || null;
    const cleanNotes = notes?.trim() || null;
    const count =
      typeof childrenCount === "number" && childrenCount > 0
        ? childrenCount
        : 1;

    // 🔍 1) Check if this email is already registered
    const { data: existing, error: existingErr } = await supabase
      .from("edtech_registrations")
      .select("id, created_at")
      .ilike("parent_email", cleanEmail) // case-insensitive
      .limit(1)
      .maybeSingle();

    if (existingErr) {
      console.error("Error checking existing registration:", existingErr);
    }

    if (existing) {
      // Already registered – don't insert again
      return NextResponse.json(
        {
          ok: true,
          alreadyRegistered: true,
          message:
            "You are already registered with this email. You can directly use the quiz and create child profiles for detailed tracking.",
        },
        { status: 409 } // Conflict – email already used
      );
    }

    // ✍️ 2) Insert new registration
    const { data: inserted, error: insertErr } = await supabase
      .from("edtech_registrations")
      .insert({
        parent_name: cleanName,
        parent_email: cleanEmail,
        phone: cleanPhone,
        children_count: count,
        children_info: cleanChildrenInfo,
        notes: cleanNotes,
      })
      .select("id, created_at, parent_name, parent_email");

    if (insertErr) {
      console.error("Error inserting registration:", insertErr);
      return NextResponse.json(
        { error: "Failed to save registration" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      registration: inserted?.[0] ?? null,
    });
  } catch (err: any) {
    console.error("Error in /api/registrations POST:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
