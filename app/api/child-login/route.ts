import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "../../../lib/supabaseClient";

function hashPassword(pw: string) {
  return crypto.createHash("sha256").update(pw).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body as {
      username: string;
      password: string;
    };

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();

    const { data, error } = await supabase
      .from("child_accounts")
      .select("id, username, child_name, parent_email, password_hash")
      .eq("username", cleanUsername)
      .maybeSingle();

    if (error) {
      console.error("Error reading child account:", error);
      return NextResponse.json(
        { error: "Login failed" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 400 }
      );
    }

    const incomingHash = hashPassword(password);

    if (incomingHash !== data.password_hash) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 400 }
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
    console.error("Error in /api/child-login:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
