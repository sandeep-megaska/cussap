import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "../../../lib/supabaseClient";

function hashPassword(pw: string) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      username,
      password,
      childName,
      parentEmail,
    }: {
      username: string;
      password: string;
      childName: string;
      parentEmail: string;
    } = body;

    if (
      !username ||
      !password ||
      !childName ||
      !parentEmail
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const cleanChildName = childName.trim();
    const cleanParentEmail = parentEmail.trim().toLowerCase();

    if (cleanUsername.length < 3) {
      return NextResponse.json(
        { error: "Username should be at least 3 characters" },
        { status: 400 }
      );
    }
    if (password.length < 4) {
      return NextResponse.json(
        { error: "Password should be at least 4 characters" },
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
        { error: "Username already taken. Please choose another." },
        { status: 400 }
      );
    }

    const passwordHash = hashPassword(password);

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
