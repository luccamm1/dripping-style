import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json();
    const validKey = process.env.ADMIN_KEY;

    if (!key || !validKey || key !== validKey) {
      return NextResponse.json({ error: "Clave incorrecta" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("admin_key", key, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/admin",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
