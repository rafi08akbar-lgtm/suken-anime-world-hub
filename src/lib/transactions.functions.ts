import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const itemInput = z.object({
  product_id: z.string().uuid(),
  product_name: z.string().min(1).max(200),
  qty: z.number().int().min(1).max(999),
  price: z.number().min(0).max(99999999),
});

async function isAdmin(supabase: any, userId: string) {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  return data?.some((r: any) => r.role === "admin") ?? false;
}

// CUSTOMER: place online order
export const createOnlineOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      customer_name: z.string().min(1).max(120),
      customer_phone: z.string().min(6).max(20),
      notes: z.string().max(500).optional(),
      items: z.array(itemInput).min(1).max(50),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const subtotal = data.items.reduce((s, i) => s + i.qty * i.price, 0);
    const { data: tx, error } = await supabaseAdmin
      .from("transactions")
      .insert({
        customer_id: context.userId,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        type: "online",
        status: "pending",
        subtotal,
        notes: data.notes ?? null,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);

    const itemsPayload = data.items.map((i) => ({ ...i, transaction_id: tx.id }));
    const { error: itemsErr } = await supabaseAdmin.from("transaction_items").insert(itemsPayload);
    if (itemsErr) throw new Error(itemsErr.message);

    return { id: tx.id, order_number: tx.order_number, subtotal };
  });

// CUSTOMER: list own orders
export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await supabaseAdmin
      .from("transactions")
      .select("*, transaction_items(*)")
      .eq("customer_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// ADMIN: list all transactions
export const adminListTransactions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (!(await isAdmin(context.supabase, context.userId))) throw new Error("Forbidden");
    const { data, error } = await supabaseAdmin
      .from("transactions")
      .select("*, transaction_items(*)")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// ADMIN: create offline (POS) transaction
export const adminCreateOfflineTransaction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      customer_name: z.string().min(1).max(120),
      customer_phone: z.string().max(20).optional(),
      notes: z.string().max(500).optional(),
      items: z.array(itemInput).min(1).max(100),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    if (!(await isAdmin(context.supabase, context.userId))) throw new Error("Forbidden");
    const subtotal = data.items.reduce((s, i) => s + i.qty * i.price, 0);
    const { data: tx, error } = await supabaseAdmin
      .from("transactions")
      .insert({
        customer_id: null,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone ?? null,
        type: "offline",
        status: "completed",
        subtotal,
        notes: data.notes ?? null,
        created_by: context.userId,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);

    const itemsPayload = data.items.map((i) => ({ ...i, transaction_id: tx.id }));
    const { error: itemsErr } = await supabaseAdmin.from("transaction_items").insert(itemsPayload);
    if (itemsErr) throw new Error(itemsErr.message);

    // decrement stock
    for (const i of data.items) {
      await supabaseAdmin.rpc; // no-op placeholder
      const { data: prod } = await supabaseAdmin.from("products").select("stock").eq("id", i.product_id).maybeSingle();
      if (prod) {
        await supabaseAdmin.from("products").update({ stock: Math.max(0, prod.stock - i.qty) }).eq("id", i.product_id);
      }
    }

    return { id: tx.id, order_number: tx.order_number, subtotal };
  });

// ADMIN: update status
export const adminUpdateTransactionStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    if (!(await isAdmin(context.supabase, context.userId))) throw new Error("Forbidden");
    const { error } = await supabaseAdmin.from("transactions").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ANY USER: get my role
export const getMyRole = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    return {
      userId: context.userId,
      roles: (data ?? []).map((r: any) => r.role as string),
      isAdmin: (data ?? []).some((r: any) => r.role === "admin"),
    };
  });
