import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Minus, Trash2 } from "lucide-react";
import { listProducts } from "@/lib/products.functions";
import { adminCreateOfflineTransaction } from "@/lib/transactions.functions";
import { formatIDR, type Product } from "@/lib/products";

export const Route = createFileRoute("/_authenticated/admin/pos")({
  component: PosPage,
});

interface Line { product: Product; qty: number; }

function PosPage() {
  const qc = useQueryClient();
  const { data: products } = useQuery({ queryKey: ["products"], queryFn: () => listProducts() });
  const [lines, setLines] = useState<Line[]>([]);
  const [name, setName] = useState("Pelanggan Ruko");
  const [phone, setPhone] = useState("");

  const add = (p: Product) => {
    setLines((l) => {
      const e = l.find((x) => x.product.id === p.id);
      if (e) return l.map((x) => x.product.id === p.id ? { ...x, qty: x.qty + 1 } : x);
      return [...l, { product: p, qty: 1 }];
    });
  };
  const setQty = (id: string, q: number) => setLines((l) => l.map((x) => x.product.id === id ? { ...x, qty: Math.max(1, q) } : x));
  const remove = (id: string) => setLines((l) => l.filter((x) => x.product.id !== id));

  const total = lines.reduce((s, l) => s + l.qty * l.product.price, 0);

  const checkout = useMutation({
    mutationFn: () => adminCreateOfflineTransaction({
      data: {
        customer_name: name || "Pelanggan Ruko",
        customer_phone: phone || undefined,
        items: lines.map((l) => ({ product_id: l.product.id, product_name: l.product.name, qty: l.qty, price: l.product.price })),
      },
    }),
    onSuccess: (res) => {
      toast.success(`Transaksi ${res.order_number} berhasil!`);
      setLines([]); setName("Pelanggan Ruko"); setPhone("");
      qc.invalidateQueries();
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div>
      <h1 className="font-display text-4xl text-stroke-thick text-primary">KASIR</h1>
      <p className="text-muted-foreground text-sm">Catat penjualan langsung di ruko.</p>
      <div className="mt-6 grid lg:grid-cols-[1fr_360px] gap-6">
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {products?.map((p) => (
              <button key={p.id} onClick={() => add(p)} className="bg-card border-[3px] border-ink rounded-xl p-3 text-left comic-shadow hover:-translate-y-0.5 transition-transform">
                <p className="font-heading font-bold text-sm leading-tight line-clamp-2">{p.name}</p>
                <p className="font-display text-lg text-primary mt-1">{formatIDR(p.price)}</p>
                <p className="text-xs text-muted-foreground">Stok: {p.stock}</p>
              </button>
            ))}
          </div>
        </section>
        <aside className="bg-card border-[3px] border-ink rounded-2xl p-4 comic-shadow-lg h-fit lg:sticky lg:top-32">
          <h2 className="font-display text-2xl mb-2">Struk</h2>
          <input placeholder="Nama pelanggan" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border-[3px] border-ink rounded-lg font-bold mb-2" />
          <input placeholder="No. HP (opsional)" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border-[3px] border-ink rounded-lg font-bold mb-3" />

          {lines.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Klik produk untuk menambah</p>}
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {lines.map((l) => (
              <li key={l.product.id} className="flex items-center gap-2 text-sm">
                <span className="flex-1 font-bold truncate">{l.product.name}</span>
                <div className="flex items-center border-2 border-ink rounded">
                  <button onClick={() => setQty(l.product.id, l.qty - 1)} className="w-6 h-6 flex items-center justify-center"><Minus className="w-3 h-3" /></button>
                  <span className="w-6 text-center font-black text-xs">{l.qty}</span>
                  <button onClick={() => setQty(l.product.id, l.qty + 1)} className="w-6 h-6 flex items-center justify-center"><Plus className="w-3 h-3" /></button>
                </div>
                <button onClick={() => remove(l.product.id)} className="text-muted-foreground hover:text-primary"><Trash2 className="w-4 h-4" /></button>
              </li>
            ))}
          </ul>

          <div className="border-t-2 border-ink mt-3 pt-3 flex justify-between font-display text-xl">
            <span>Total</span><span>{formatIDR(total)}</span>
          </div>
          <button disabled={lines.length === 0 || checkout.isPending} onClick={() => checkout.mutate()} className="w-full mt-3 bg-primary text-primary-foreground border-[3px] border-ink rounded-lg py-3 font-black text-lg comic-shadow disabled:opacity-50">
            {checkout.isPending ? "..." : "SIMPAN TRANSAKSI"}
          </button>
        </aside>
      </div>
    </div>
  );
}
