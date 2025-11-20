import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid body" },
        { status: 400 }
      );
    }

    const {
      parentName,
      parentEmail,
      phone,
      childrenCount,
      childrenInfo,
      notes,
    } = body as {
      parentName?: string;
      parentEmail?: string;
      phone?: string;
      childrenCount?: number;
      childrenInfo?: string;
      notes?: string;
    };

    if (!parentName || !parentEmail) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("edtech_registrations")
      .insert({
        parent_name: parentName,
        parent_email: parentEmail,
        phone: phone || null,
        children_count: childrenCount || 1,
        children_info: childrenInfo || null,
        notes: notes || null,
      });

    if (error) {
      console.error("Error inserting registration:", error);
      return NextResponse.json(
        { error: "Failed to save registration" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Error in /api/registrations POST:", err);
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}

// Simple admin list (later you can protect this)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("edtech_registrations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      console.error("Error loading registrations:", error);
      return NextResponse.json(
        { error: "Failed to load registrations" },
        { status: 500 }
      );
    }

    return NextResponse.json({ registrations: data ?? [] });
  } catch (err: any) {
    console.error("Error in /api/registrations GET:", err);
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
