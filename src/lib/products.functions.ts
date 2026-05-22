import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Product } from "./products";

const productRow = (r: any): Product => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  description: r.description,
  price: Number(r.price),
  category: r.category,
  image_url: r.image_url,
  stock: r.stock,
  is_featured: r.is_featured,
  is_active: r.is_active,
});

// PUBLIC: list active products
export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(productRow);
});

// PUBLIC: single product by slug
export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("slug", data.slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? productRow(row) : null;
  });

// ADMIN: list ALL (including inactive)
export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (!roles?.some((r) => r.role === "admin")) throw new Error("Forbidden");
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(productRow);
  });

const productInput = z.object({
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/, "lowercase, angka, dash"),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
  price: z.number().min(0).max(99999999),
  category: z.enum(["plush", "cosplay", "figure", "accessory"]),
  image_url: z.string().max(500).optional().nullable(),
  stock: z.number().int().min(0).max(99999),
  is_featured: z.boolean(),
  is_active: z.boolean(),
});

async function assertAdmin(supabase: any, userId: string) {
  const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (!roles?.some((r: any) => r.role === "admin")) throw new Error("Forbidden: admin only");
}

export const adminCreateProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => productInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { data: row, error } = await supabaseAdmin.from("products").insert(data).select().single();
    if (error) throw new Error(error.message);
    return productRow(row);
  });

export const adminUpdateProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => productInput.extend({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { id, ...patch } = data;
    const { data: row, error } = await supabaseAdmin.from("products").update(patch).eq("id", id).select().single();
    if (error) throw new Error(error.message);
    return productRow(row);
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await supabaseAdmin.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
