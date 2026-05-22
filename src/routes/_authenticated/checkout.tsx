import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { useCart } from "@/lib/store";
import { formatIDR } from "@/lib/products";
import { createOnlineOrder } from "@/lib/transactions.functions";

export const Route = createFileRoute("/_authenticated/checkout")({
  component: CheckoutPage,
  head: () => ({ meta: [{ title: "Checkout — SUKEN" }] }),
});

const WA_PHONE = "6281234567890";

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const total = subtotal();

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="font-bold">Keranjang kosong.</p>
        <Link to="/shop" className="inline-block mt-4 bg-primary text-primary-foreground border-[3px] border-ink rounded-lg px-6 py-3 font-black comic-shadow">Mulai belanja</Link>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createOnlineOrder({
        data: {
          customer_name: name,
          customer_phone: phone,
          notes: notes || undefined,
          items: items.map((i) => ({
            product_id: i.product.id,
            product_name: i.product.name,
            qty: i.qty,
            price: i.product.price,
          })),
        },
      });
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 }, colors: ["#E63946", "#FFBE0B"] });
      toast.success("Pesanan terkirim!");
      const message = encodeURIComponent(
        `Halo SUKEN! Saya baru saja membuat pesanan ${res.order_number} senilai ${formatIDR(res.subtotal)}. Mohon konfirmasi pembayaran & pengiriman ya. Terima kasih!`,
      );
      clear();
      window.open(`https://wa.me/${WA_PHONE}?text=${message}`, "_blank");
      navigate({ to: "/account" });
    } catch (err: any) {
      toast.error(err.message || "Gagal membuat pesanan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-display text-5xl text-stroke-thick text-primary mb-6">CHECKOUT</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={submit} className="bg-card border-[3px] border-ink rounded-2xl p-6 comic-shadow space-y-3">
          <h2 className="font-display text-2xl">Data Pemesan</h2>
          <input required placeholder="Nama lengkap" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-background border-[3px] border-ink rounded-lg font-bold" />
          <input required placeholder="No. WhatsApp (cth 0812...)" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 bg-background border-[3px] border-ink rounded-lg font-bold" />
          <textarea placeholder="Catatan (alamat / kirim atau ambil di ruko)" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full px-4 py-3 bg-background border-[3px] border-ink rounded-lg font-bold" />
          <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground border-[3px] border-ink rounded-lg py-3 font-black text-lg comic-shadow disabled:opacity-50">
            {loading ? "Mengirim..." : "BUAT PESANAN & LANJUT KE WA"}
          </button>
          <p className="text-xs text-muted-foreground">Setelah pesanan dibuat, kamu akan diarahkan ke WhatsApp admin untuk konfirmasi pembayaran & pengiriman.</p>
        </form>

        <aside className="bg-secondary border-[3px] border-ink rounded-2xl p-6 comic-shadow-lg h-fit">
          <h2 className="font-display text-2xl mb-3">Pesananmu</h2>
          <ul className="space-y-2 text-sm font-bold">
            {items.map((i) => (
              <li key={i.product.id} className="flex justify-between"><span>{i.qty}× {i.product.name}</span><span>{formatIDR(i.qty * i.product.price)}</span></li>
            ))}
          </ul>
          <div className="border-t-2 border-ink mt-3 pt-3 flex justify-between font-display text-2xl">
            <span>Total</span><span>{formatIDR(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
