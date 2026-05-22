import { createFileRoute, Outlet, Link, redirect } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingBag, Receipt } from "lucide-react";
import { getMyRole } from "@/lib/transactions.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    try {
      const r = await getMyRole();
      if (!r.isAdmin) throw redirect({ to: "/" });
    } catch (e: any) {
      if (e?.options?.to) throw e;
      throw redirect({ to: "/login" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const nav = [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
    { to: "/admin/products", icon: Package, label: "Produk" },
    { to: "/admin/pos", icon: ShoppingBag, label: "Kasir (POS)" },
    { to: "/admin/transactions", icon: Receipt, label: "Transaksi" },
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 grid md:grid-cols-[220px_1fr] gap-6">
      <aside className="bg-card border-[3px] border-ink rounded-2xl p-3 comic-shadow h-fit md:sticky md:top-32">
        <p className="font-display text-2xl text-primary text-stroke px-3 py-2">ADMIN</p>
        <nav className="flex md:flex-col gap-1 mt-2">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.exact }} className="flex items-center gap-2 px-3 py-2 rounded-lg font-bold hover:bg-secondary" activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary" }}>
              <n.icon className="w-4 h-4" /> {n.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main><Outlet /></main>
    </div>
  );
}
