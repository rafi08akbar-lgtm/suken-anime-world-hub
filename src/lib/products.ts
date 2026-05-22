export type Category = "plush" | "cosplay" | "figure" | "accessory";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  stock: number;
  is_featured: boolean;
  is_active?: boolean;
}

export const CATEGORIES: { id: Category; label: string; emoji: string; tagline: string }[] = [
  { id: "plush", label: "Plush Dolls", emoji: "🧸", tagline: "Cuddle your fave waifu" },
  { id: "cosplay", label: "Cosplay Outfits", emoji: "🥷", tagline: "Become the hero" },
  { id: "figure", label: "Action Figures", emoji: "⚔️", tagline: "Pose. Display. Repeat." },
  { id: "accessory", label: "Accessories", emoji: "🎀", tagline: "Carry the fandom" },
];

export function categoryLabel(id: string) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

export function productImage(p: Pick<Product, "image_url">) {
  return p.image_url || "/products/product-plush.jpg";
}
