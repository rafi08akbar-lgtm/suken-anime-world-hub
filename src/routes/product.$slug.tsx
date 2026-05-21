import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, Share2, Truck, ShieldCheck, Star, Minus, Plus } from "lucide-react";
import { useState } from "react";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";
import { getProduct, PRODUCTS, formatIDR } from "@/lib/products";
import { useCart } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — SUKEN` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: loaderData.product.name },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const add = useCart((s) => s.add);
  const toggleWish = useCart((s) => s.toggleWish);
  const wished = useCart((s) => s.wishlist.includes(product.id));
  const [qty, setQty] = useState(1);

  const onAdd = () => {
    for (let i = 0; i < qty; i++) add(product);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#E63946", "#FFBE0B", "#1A1A2E"],
    });
    toast.success(`${qty}× ${product.name} added!`, { icon: "🎉" });
  };

  const related = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <nav className="text-sm font-bold text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">Home</Link> /{" "}
        <Link to="/shop" className="hover:text-primary">Shop</Link> /{" "}
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="bg-surface border-[3px] border-ink rounded-2xl overflow-hidden comic-shadow-lg aspect-square">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div>
          <p className="text-sm font-black text-primary uppercase tracking-wider">{product.fandom}</p>
          <h1 className="font-display text-4xl md:text-5xl mt-2">{product.name}</h1>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? "fill-secondary text-secondary" : "text-muted-foreground"}`} />
              ))}
            </div>
            <span className="text-sm font-bold">{product.rating} · 142 reviews</span>
          </div>

          <div className="font-display text-5xl text-primary text-stroke-thick mt-6">{formatIDR(product.price)}</div>

          {product.stock <= 5 && (
            <p className="mt-3 inline-block bg-warning/20 border-2 border-warning text-warning-foreground px-3 py-1 rounded-full text-sm font-black">
              🔥 Only {product.stock} left — order fast!
            </p>
          )}

          <p className="mt-5 text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Qty + Add */}
          <div className="mt-8 flex flex-wrap gap-3">
            <div className="flex items-center bg-card border-[3px] border-ink rounded-lg overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-12 h-12 flex items-center justify-center hover:bg-secondary"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-black">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-12 h-12 flex items-center justify-center hover:bg-secondary"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={onAdd}
              className="flex-1 min-w-[200px] bg-primary text-primary-foreground border-[3px] border-ink rounded-lg px-6 py-3 font-black text-lg comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              ADD TO CART 🛒
            </button>
            <button
              onClick={() => toggleWish(product.id)}
              className={`w-12 h-12 border-[3px] border-ink rounded-lg flex items-center justify-center comic-shadow ${
                wished ? "bg-primary text-primary-foreground" : "bg-card"
              }`}
            >
              <Heart className={`w-5 h-5 ${wished ? "fill-current" : ""}`} />
            </button>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied!");
            }}
            className="mt-3 inline-flex items-center gap-2 text-sm font-bold hover:text-primary"
          >
            <Share2 className="w-4 h-4" /> Share this beast
          </button>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="flex items-start gap-3 bg-surface border-2 border-ink rounded-lg p-3">
              <Truck className="w-5 h-5 mt-0.5 text-primary" />
              <div>
                <p className="font-black text-sm">Fast Shipping</p>
                <p className="text-xs text-muted-foreground">2-3 days nationwide</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-surface border-2 border-ink rounded-lg p-3">
              <ShieldCheck className="w-5 h-5 mt-0.5 text-primary" />
              <div>
                <p className="font-black text-sm">100% Original</p>
                <p className="text-xs text-muted-foreground">Anime-guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-3xl text-stroke-thick text-secondary mb-6">FANS ALSO BOUGHT</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
