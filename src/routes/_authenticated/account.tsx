import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listMyOrders } from "@/lib/transactions.functions";
import { formatIDR } from "@/lib/products";

export const Route = createFileRoute("/_authenticated/account")({
  component: AccountPage,
  head: () => ({ meta: [{ title: "Akun Saya — SUKEN" }] }),
});

const statusColor: Record<string, string> = {
  pending: "bg-warning text-ink",
  confirmed: "bg-secondary text-ink",
  completed: "bg-success text-background",
  cancelled: "bg-muted text-muted-foreground",
};

function AccountPage() {
  const { data: orders, isLoading } = useQuery({ queryKey: ["my-orders"], queryFn: () => listMyOrders() });

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display text-5xl text-stroke-thick text-primary">AKUN SAYA</h1>
      <p className="text-muted-foreground mt-2">Daftar pesanan online kamu.</p>

      <div className="mt-8 space-y-4">
        {isLoading && <p>Memuat...</p>}
        {orders?.length === 0 && (
          <div className="bg-card border-[3px] border-ink rounded-2xl p-8 text-center comic-shadow">
            <p className="font-bold">Belum ada pesanan.</p>
            <Link to="/shop" className="inline-block mt-4 bg-primary text-primary-foreground border-[3px] border-ink rounded-lg px-6 py-3 font-black comic-shadow">Mulai belanja</Link>
          </div>
        )}
        {orders?.map((o: any) => (
          <div key={o.id} className="bg-card border-[3px] border-ink rounded-2xl p-5 comic-shadow">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <p className="font-display text-xl">{o.order_number}</p>
                <p className="text-xs text-muted-foreground font-bold">{new Date(o.created_at).toLocaleString("id-ID")}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black border-2 border-ink ${statusColor[o.status] || ""}`}>{o.status.toUpperCase()}</span>
            </div>
            <ul className="mt-3 text-sm space-y-1">
              {o.transaction_items?.map((it: any) => (
                <li key={it.id} className="flex justify-between"><span>{it.qty}× {it.product_name}</span><span className="font-bold">{formatIDR(it.qty * Number(it.price))}</span></li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t-2 border-ink flex justify-between font-display text-lg">
              <span>Total</span><span>{formatIDR(Number(o.subtotal))}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
