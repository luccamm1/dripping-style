import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await _req.json();

    if (body.status === "pagado") {
      const { data: order } = await supabase
        .from("orders")
        .select("items")
        .eq("id", id)
        .single();

      if (order?.items) {
        for (const item of order.items) {
          const productId = item.product?.id || item.product_id;
          const qty = item.quantity || 1;

          const { data: product } = await supabase
            .from("products")
            .select("stock")
            .eq("id", productId)
            .single();

          if (product) {
            const newStock = Math.max(0, (product.stock || 0) - qty);
            await supabase
              .from("products")
              .update({ stock: newStock })
              .eq("id", productId);
          }
        }
      }
    }

    const { data, error } = await supabase
      .from("orders")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating order:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error parsing request:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { error } = await supabase
    .from("orders")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting order:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
