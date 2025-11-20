import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabaseClient";

export async function GET() {
  try {
    // Total registrations
    const { count: regCount, error: regError } = await supabase
      .from("edtech_registrations")
      .select("*", { count: "exact", head: true });

    if (regError) {
      console.error("Admin stats: regError", regError);
    }

    // Total quiz sessions
    const { count: sessionCount, error: sessionError } = await supabase
      .from("quiz_sessions")
      .select("*", { count: "exact", head: true });

    if (sessionError) {
      console.error("Admin stats: sessionError", sessionError);
    }

    // Unique parent emails from registrations
    const { data: parentsData, error: parentsError } = await supabase
      .from("edtech_registrations")
      .select("parent_email")
      .not("parent_email", "is", null);

    if (parentsError) {
      console.error("Admin stats: parentsError", parentsError);
    }

    const uniqueParents =
      parentsData && parentsData.length > 0
        ? new Set(
            parentsData
              .map((r) => (r.parent_email || "").trim().toLowerCase())
              .filter((x) => x.length > 0)
          ).size
        : 0;

    return NextResponse.json({
      totalRegistrations: regCount ?? 0,
      totalSessions: sessionCount ?? 0,
      uniqueParents,
    });
  } catch (err: any) {
    console.error("Error in /api/admin-stats:", err);
    return NextResponse.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
