import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "../../../lib/supabaseClient";

function hashPassword(pw: string) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("DEBUG /api/child-signup body:", body);

    const {
      username,
      password,
      childName,
      parentEmail,
    } = body as {
      username?: string;
      password?: string;
      childName?: string;
      parentEmail?: string;
    };

    const cleanUsername = (username ?? "").trim().toLowerCase();
    const cleanChildName = (childName ?? "").trim();
    const cleanParentEmail = (parentEmail ?? "").trim().toLowerCase();
    const rawPassword = (password ?? "").trim();

    if (!cleanUsername || !rawPassword || !cleanChildName || !cleanParentEmail) {
      const missing: string[] = [];
      if (!cleanUsername) missing.push("username");
      if (!rawPassword) missing.push("password");
      if (!cleanChildName) missing.push("childName");
      if (!cleanParentEmail) missing.push("parentEmail");

      return NextResponse.json(
        {
          error: `All fields are required. Missing: ${missing.join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (cleanUsername.length < 3) {
      return NextResponse.json(
        { error: "Username should be at least 3 characters" },
        { status: 400 }
      );
    }
    if (rawPassword.length < 4) {
      return NextResponse.json(
        { error: "Password should be at least 4 characters" },
        { status: 400 }
      );
    }

    // ✅ Check that parent email is already registered
    const { data: parentReg, error: parentRegError } = await supabase
      .from("edtech_registrations")
      .select("id")
      .ilike("parent_email", cleanParentEmail)
      .maybeSingle();

    if (parentRegError) {
      console.error("Error checking parent registration:", parentRegError);
    }

    if (!parentReg) {
      return NextResponse.json(
        {
          error:
            "This parent email is not registered yet. Please register / log in as a parent first, then create child profiles.",
        },
        { status: 400 }
      );
    }

    // Check if username taken
    const { data: existing, error: existingErr } = await supabase
      .from("child_accounts")
      .select("id")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (existingErr) {
      console.error("Error checking username:", existingErr);
    }

    if (existing) {
      return NextResponse.json(
        { error: "This username is already taken. Please choose another." },
        { status: 400 }
      );
    }

    const passwordHash = hashPassword(rawPassword);

    const { data, error } = await supabase
      .from("child_accounts")
      .insert({
        username: cleanUsername,
        password_hash: passwordHash,
        child_name: cleanChildName,
        parent_email: cleanParentEmail,
      })
      .select("id, username, child_name, parent_email")
      .single();

    if (error) {
      console.error("Error creating child account:", error);
      return NextResponse.json(
        { error: "Failed to create child profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      profile: {
        id: data.id,
        username: data.username,
        childName: data.child_name,
        parentEmail: data.parent_email,
      },
    });
  } catch (err: any) {
    console.error("Error in /api/child-signup:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
