import { Link } from "@tanstack/react-router";
import { Heart, Plus } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";
import { type Product, formatIDR, productImage, categoryLabel } from "@/lib/products";
import { useCart } from "@/lib/store";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const add = useCart((s) => s.add);
  const toggleWish = useCart((s) => s.toggleWish);
  const wished = useCart((s) => s.wishlist.includes(product.id));

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    add(product);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#E63946", "#FFBE0B", "#1A1A2E"],
    });
    toast.success(`${product.name} added!`, { icon: "🎉" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
    >
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="group block bg-card border-[3px] border-ink rounded-2xl overflow-hidden comic-shadow hover:comic-shadow-lg hover:-translate-y-1 hover:-translate-x-1 transition-all relative"
      >
        {product.is_featured && (
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2 py-0.5 text-xs font-black border-2 border-ink rounded-md rotate-[-4deg] bg-primary text-primary-foreground">
              HOT
            </span>
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWish(product.id);
          }}
          className="absolute top-3 right-3 z-10 w-9 h-9 bg-background border-2 border-ink rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Toggle wishlist"
        >
          <Heart className={`w-4 h-4 ${wished ? "fill-primary text-primary" : ""}`} />
        </button>

        <div className="aspect-square bg-surface overflow-hidden">
          <img
            src={productImage(product)}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        <div className="p-4 border-t-[3px] border-ink">
          <p className="text-xs font-bold text-primary uppercase tracking-wider">{categoryLabel(product.category)}</p>
          <h3 className="font-heading font-bold text-base leading-tight mt-1 line-clamp-2">{product.name}</h3>
          <div className="flex items-center justify-between mt-3">
            <span className="font-display text-xl text-ink">{formatIDR(product.price)}</span>
            <button
              onClick={onAdd}
              className="w-10 h-10 bg-primary text-primary-foreground border-2 border-ink rounded-full flex items-center justify-center hover:rotate-90 hover:scale-110 transition-transform"
              aria-label="Add to cart"
            >
              <Plus className="w-5 h-5" strokeWidth={3} />
            </button>
          </div>
          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-xs font-bold text-primary mt-2">🔥 Tersisa {product.stock}!</p>
          )}
          {product.stock === 0 && <p className="text-xs font-bold text-muted-foreground mt-2">Habis</p>}
        </div>
      </Link>
    </motion.div>
  );
}
