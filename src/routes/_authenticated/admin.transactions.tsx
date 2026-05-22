import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { adminListTransactions, adminUpdateTransactionStatus } from "@/lib/transactions.functions";
import { formatIDR } from "@/lib/products";

export const Route = createFileRoute("/_authenticated/admin/transactions")({
  component: AdminTxPage,
});

const STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;

function AdminTxPage() {
  const qc = useQueryClient();
  const { data: txs } = useQuery({ queryKey: ["admin-tx"], queryFn: () => adminListTransactions() });
  const [filter, setFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const upd = useMutation({
    mutationFn: ({ id, status }: { id: string; status: any }) => adminUpdateTransactionStatus({ data: { id, status } }),
    onSuccess: () => { toast.success("Status diperbarui"); qc.invalidateQueries({ queryKey: ["admin-tx"] }); },
    onError: (e: any) => toast.error(e.message),
  });

  const filtered = (txs ?? []).filter((t: any) => (filter === "all" || t.status === filter) && (typeFilter === "all" || t.type === typeFilter));

  return (
    <div>
      <h1 className="font-display text-4xl text-stroke-thick text-primary">TRANSAKSI</h1>
      <div className="flex gap-2 mt-4 flex-wrap">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 border-[3px] border-ink rounded-lg font-bold bg-card">
          <option value="all">Semua status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-3 py-2 border-[3px] border-ink rounded-lg font-bold bg-card">
          <option value="all">Semua tipe</option>
          <option value="online">Online</option>
          <option value="offline">Offline (kasir)</option>
        </select>
      </div>

      <div className="mt-4 space-y-3">
        {filtered.length === 0 && <p className="text-muted-foreground text-center py-8">Tidak ada transaksi.</p>}
        {filtered.map((t: any) => (
          <details key={t.id} className="bg-card border-[3px] border-ink rounded-2xl comic-shadow">
            <summary className="cursor-pointer p-4 flex flex-wrap gap-3 items-center justify-between">
              <div>
                <p className="font-display text-lg">{t.order_number} <span className="text-xs font-bold uppercase ml-2 px-2 py-0.5 bg-secondary border-2 border-ink rounded">{t.type}</span></p>
                <p className="text-xs text-muted-foreground font-bold">{t.customer_name} {t.customer_phone && `· ${t.customer_phone}`} · {new Date(t.created_at).toLocaleString("id-ID")}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl">{formatIDR(Number(t.subtotal))}</span>
                <select value={t.status} onChange={(e) => upd.mutate({ id: t.id, status: e.target.value })} onClick={(e) => e.stopPropagation()} className="px-2 py-1 border-2 border-ink rounded font-bold text-xs uppercase bg-background">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </summary>
            <div className="px-4 pb-4 border-t-2 border-ink/10">
              <ul className="text-sm mt-2 space-y-1">
                {t.transaction_items?.map((it: any) => (
                  <li key={it.id} className="flex justify-between"><span>{it.qty}× {it.product_name}</span><span className="font-bold">{formatIDR(it.qty * Number(it.price))}</span></li>
                ))}
              </ul>
              {t.notes && <p className="mt-2 text-sm bg-surface border-2 border-ink rounded p-2"><strong>Catatan:</strong> {t.notes}</p>}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
