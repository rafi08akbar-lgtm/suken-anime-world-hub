import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/lib/store";
import { formatIDR, productImage, categoryLabel } from "@/lib/products";
import mascot from "@/assets/mascot.png";

export const Route = createFileRoute("/cart")({
  component: Cart,
  head: () => ({ meta: [{ title: "Keranjang — SUKEN" }] }),
});

function Cart() {
  const { items, setQty, remove, subtotal } = useCart();
  const total = subtotal();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <img src={mascot} alt="Sad mascot" className="w-48 h-48 mx-auto opacity-80 grayscale" />
        <h1 className="font-display text-5xl text-primary text-stroke-thick mt-4">Keranjang kosong!</h1>
        <p className="text-muted-foreground mt-2">Yuk isi keranjangmu dengan koleksi anime favoritmu!</p>
        <Link to="/shop" className="inline-block mt-6 bg-primary text-primary-foreground border-[3px] border-ink rounded-lg px-6 py-3 font-black comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
          MULAI BELANJA →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display text-5xl text-stroke-thick text-primary mb-8">KERANJANG</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="bg-card border-[3px] border-ink rounded-2xl p-4 comic-shadow flex gap-4">
              <img src={productImage(item.product)} alt={item.product.name} className="w-24 h-24 object-cover rounded-lg border-2 border-ink" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-primary uppercase">{categoryLabel(item.product.category)}</p>
                <h3 className="font-heading font-bold truncate">{item.product.name}</h3>
                <p className="font-display text-xl mt-1">{formatIDR(item.product.price)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => remove(item.product.id)} className="text-muted-foreground hover:text-primary">
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center bg-surface border-2 border-ink rounded-lg overflow-hidden">
                  <button onClick={() => setQty(item.product.id, item.qty - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-secondary">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center font-black text-sm">{item.qty}</span>
                  <button onClick={() => setQty(item.product.id, item.qty + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-secondary">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-secondary border-[3px] border-ink rounded-2xl p-6 comic-shadow-lg h-fit sticky top-32">
          <h2 className="font-display text-2xl mb-4">RINGKASAN PESANAN</h2>
          <div className="space-y-2 font-bold">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatIDR(total)}</span>
            </div>
            <div className="border-t-2 border-ink pt-2 mt-2 flex justify-between font-display text-2xl">
              <span>Total</span>
              <span>{formatIDR(total)}</span>
            </div>
          </div>
          <p className="text-xs mt-3 text-ink/80">Pembayaran & pengiriman dikonfirmasi via WhatsApp setelah checkout.</p>
          <Link
            to="/checkout"
            className="block text-center w-full mt-4 bg-primary text-primary-foreground border-[3px] border-ink rounded-lg py-3 font-black text-lg comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            CHECKOUT →
          </Link>
          <Link to="/shop" className="block text-center mt-3 font-bold underline">
            Lanjut belanja
          </Link>
        </aside>
      </div>
    </div>
  );
}
