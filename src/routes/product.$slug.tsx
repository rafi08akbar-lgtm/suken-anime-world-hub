import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, Share2, Truck, ShieldCheck, Minus, Plus } from "lucide-react";
import { useState } from "react";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { formatIDR, productImage, categoryLabel } from "@/lib/products";
import { getProductBySlug, listProducts } from "@/lib/products.functions";
import { useCart } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";

const allProductsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
});

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params, context }) => {
    const [product] = await Promise.all([
      getProductBySlug({ data: { slug: params.slug } }),
      context.queryClient.ensureQueryData(allProductsQuery),
    ]);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — SUKEN` },
          { name: "description", content: loaderData.product.description ?? "" },
          { property: "og:title", content: loaderData.product.name },
          { property: "og:image", content: loaderData.product.image_url ?? "" },
        ]
      : [],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { data: all } = useSuspenseQuery(allProductsQuery);
  const add = useCart((s) => s.add);
  const toggleWish = useCart((s) => s.toggleWish);
  const wished = useCart((s) => s.wishlist.includes(product.id));
  const [qty, setQty] = useState(1);

  const onAdd = () => {
    for (let i = 0; i < qty; i++) add(product);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors: ["#E63946", "#FFBE0B", "#1A1A2E"] });
    toast.success(`${qty}× ${product.name} ditambahkan!`, { icon: "🎉" });
  };

  const related = all.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <nav className="text-sm font-bold text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link> /{" "}
        <Link to="/shop" className="hover:text-primary">Shop</Link> /{" "}
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="bg-surface border-[3px] border-ink rounded-2xl overflow-hidden comic-shadow-lg aspect-square">
          <img src={productImage(product)} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div>
          <p className="text-sm font-black text-primary uppercase tracking-wider">{categoryLabel(product.category)}</p>
          <h1 className="font-display text-4xl md:text-5xl mt-2">{product.name}</h1>
          <div className="font-display text-5xl text-primary text-stroke-thick mt-6">{formatIDR(product.price)}</div>

          {product.stock <= 5 && product.stock > 0 && (
            <p className="mt-3 inline-block bg-warning/20 border-2 border-warning text-warning-foreground px-3 py-1 rounded-full text-sm font-black">
              🔥 Tersisa {product.stock} — buruan!
            </p>
          )}
          {product.stock === 0 && (
            <p className="mt-3 inline-block bg-muted border-2 border-ink px-3 py-1 rounded-full text-sm font-black">
              Stok habis
            </p>
          )}

          <p className="mt-5 text-muted-foreground leading-relaxed">{product.description}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="flex items-center bg-card border-[3px] border-ink rounded-lg overflow-hidden">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-12 flex items-center justify-center hover:bg-secondary">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-black">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-12 h-12 flex items-center justify-center hover:bg-secondary">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={onAdd}
              disabled={product.stock === 0}
              className="flex-1 min-w-[200px] bg-primary text-primary-foreground border-[3px] border-ink rounded-lg px-6 py-3 font-black text-lg comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock === 0 ? "STOK HABIS" : "TAMBAH KE KERANJANG 🛒"}
            </button>
            <button onClick={() => toggleWish(product.id)} className={`w-12 h-12 border-[3px] border-ink rounded-lg flex items-center justify-center comic-shadow ${wished ? "bg-primary text-primary-foreground" : "bg-card"}`}>
              <Heart className={`w-5 h-5 ${wished ? "fill-current" : ""}`} />
            </button>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link tersalin!");
            }}
            className="mt-3 inline-flex items-center gap-2 text-sm font-bold hover:text-primary"
          >
            <Share2 className="w-4 h-4" /> Bagikan
          </button>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="flex items-start gap-3 bg-surface border-2 border-ink rounded-lg p-3">
              <Truck className="w-5 h-5 mt-0.5 text-primary" />
              <div>
                <p className="font-black text-sm">Online + Offline</p>
                <p className="text-xs text-muted-foreground">Diantar / ambil di ruko</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-surface border-2 border-ink rounded-lg p-3">
              <ShieldCheck className="w-5 h-5 mt-0.5 text-primary" />
              <div>
                <p className="font-black text-sm">100% Original</p>
                <p className="text-xs text-muted-foreground">Dijamin keasliannya</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-3xl text-stroke-thick text-secondary mb-6">FANS JUGA BELI</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
