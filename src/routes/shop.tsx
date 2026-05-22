import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Search } from "lucide-react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { CATEGORIES, type Category } from "@/lib/products";
import { listProducts } from "@/lib/products.functions";
import { ProductCard } from "@/components/ProductCard";

const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
});

const search = z.object({
  cat: z.enum(["plush", "cosplay", "figure", "accessory"]).optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: search,
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: Shop,
  head: () => ({
    meta: [
      { title: "Shop All Anime Merch — SUKEN" },
      { name: "description", content: "Browse plush dolls, cosplay outfits, action figures, and anime accessories." },
    ],
  }),
});

function Shop() {
  const { cat, q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [sort, setSort] = useState<"popular" | "price-asc" | "price-desc">("popular");
  const { data: products } = useSuspenseQuery(productsQuery);

  const filtered = products
    .filter((p) => (!cat || p.category === cat) && (!q || p.name.toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return Number(b.is_featured) - Number(a.is_featured);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <header className="mb-8">
        <h1 className="font-display text-5xl md:text-6xl text-stroke-thick text-primary">SHOP THE ARSENAL</h1>
        <p className="text-muted-foreground mt-2">Semua merch anime kamu di sini. {filtered.length} item ditemukan.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari Naruto, plush, Saiyan..."
            defaultValue={q || ""}
            onChange={(e) => navigate({ search: (s: z.infer<typeof search>) => ({ ...s, q: e.target.value || undefined }) })}
            className="w-full pl-11 pr-4 py-3 bg-card border-[3px] border-ink rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="px-4 py-3 bg-card border-[3px] border-ink rounded-lg font-bold cursor-pointer">
          <option value="popular">Paling Populer</option>
          <option value="price-asc">Harga: Termurah</option>
          <option value="price-desc">Harga: Termahal</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button onClick={() => navigate({ search: (s: z.infer<typeof search>) => ({ ...s, cat: undefined }) })} className={`px-4 py-2 border-[3px] border-ink rounded-full font-black text-sm transition-all ${!cat ? "bg-ink text-background" : "bg-card hover:bg-secondary"}`}>
          SEMUA
        </button>
        {CATEGORIES.map((c) => (
          <button key={c.id} onClick={() => navigate({ search: (s: z.infer<typeof search>) => ({ ...s, cat: c.id as Category }) })} className={`px-4 py-2 border-[3px] border-ink rounded-full font-black text-sm transition-all ${cat === c.id ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary"}`}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-4">🕵️</div>
          <h2 className="font-display text-3xl">Tidak ada hasil</h2>
          <p className="text-muted-foreground mt-2">Coba kata kunci atau kategori lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
