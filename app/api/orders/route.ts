import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from("orders")
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error("Error creating order:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Error parsing request:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
