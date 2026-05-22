import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { adminListTransactions } from "@/lib/transactions.functions";
import { formatIDR } from "@/lib/products";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: txs } = useQuery({ queryKey: ["admin-tx"], queryFn: () => adminListTransactions() });
  const today = new Date().toISOString().slice(0, 10);
  const todayTx = (txs ?? []).filter((t: any) => t.created_at.slice(0, 10) === today);
  const omzet = todayTx.filter((t: any) => t.status === "completed").reduce((s: number, t: any) => s + Number(t.subtotal), 0);
  const pending = (txs ?? []).filter((t: any) => t.status === "pending").length;

  const cards = [
    { label: "Transaksi Hari Ini", val: todayTx.length, bg: "bg-primary text-primary-foreground" },
    { label: "Omzet Hari Ini", val: formatIDR(omzet), bg: "bg-secondary text-ink" },
    { label: "Pesanan Pending", val: pending, bg: "bg-ink text-secondary" },
  ];
  return (
    <div>
      <h1 className="font-display text-4xl text-stroke-thick text-primary">DASHBOARD</h1>
      <div className="grid sm:grid-cols-3 gap-4 mt-6">
        {cards.map((c) => (
          <div key={c.label} className={`${c.bg} border-[3px] border-ink rounded-2xl p-6 comic-shadow-lg`}>
            <p className="font-bold text-sm uppercase opacity-80">{c.label}</p>
            <p className="font-display text-4xl mt-2">{c.val}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-card border-[3px] border-ink rounded-2xl p-5 comic-shadow">
        <h2 className="font-display text-2xl">Transaksi Terbaru</h2>
        <ul className="mt-3 divide-y-2 divide-ink/10">
          {(txs ?? []).slice(0, 8).map((t: any) => (
            <li key={t.id} className="py-2 flex justify-between text-sm">
              <span className="font-bold">{t.order_number} · {t.customer_name}</span>
              <span>{formatIDR(Number(t.subtotal))} · <span className="uppercase">{t.status}</span></span>
            </li>
          ))}
          {(txs ?? []).length === 0 && <li className="py-4 text-muted-foreground">Belum ada transaksi.</li>}
        </ul>
      </div>
    </div>
  );
}
