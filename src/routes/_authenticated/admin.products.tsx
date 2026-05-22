import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2, Plus } from "lucide-react";
import { adminListProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from "@/lib/products.functions";
import { formatIDR, CATEGORIES, type Product } from "@/lib/products";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: AdminProductsPage,
});

type FormState = {
  id?: string;
  slug: string; name: string; description: string; price: number;
  category: "plush" | "cosplay" | "figure" | "accessory";
  image_url: string; stock: number; is_featured: boolean; is_active: boolean;
};

const emptyForm: FormState = {
  slug: "", name: "", description: "", price: 0, category: "plush",
  image_url: "", stock: 0, is_featured: false, is_active: true,
};

function AdminProductsPage() {
  const qc = useQueryClient();
  const { data: products } = useQuery({ queryKey: ["admin-products"], queryFn: () => adminListProducts() });
  const [editing, setEditing] = useState<FormState | null>(null);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-products"] });
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  const createMut = useMutation({
    mutationFn: (f: FormState) => adminCreateProduct({ data: f }),
    onSuccess: () => { toast.success("Produk ditambah"); setEditing(null); invalidate(); },
    onError: (e: any) => toast.error(e.message),
  });
  const updateMut = useMutation({
    mutationFn: (f: FormState & { id: string }) => adminUpdateProduct({ data: f }),
    onSuccess: () => { toast.success("Produk diupdate"); setEditing(null); invalidate(); },
    onError: (e: any) => toast.error(e.message),
  });
  const delMut = useMutation({
    mutationFn: (id: string) => adminDeleteProduct({ data: { id } }),
    onSuccess: () => { toast.success("Produk dihapus"); invalidate(); },
    onError: (e: any) => toast.error(e.message),
  });

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (editing.id) updateMut.mutate({ ...editing, id: editing.id });
    else createMut.mutate(editing);
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-4xl text-stroke-thick text-primary">PRODUK</h1>
        <button onClick={() => setEditing({ ...emptyForm })} className="flex items-center gap-1 bg-primary text-primary-foreground border-[3px] border-ink rounded-lg px-4 py-2 font-black comic-shadow">
          <Plus className="w-4 h-4" /> Tambah Produk
        </button>
      </div>

      <div className="mt-6 bg-card border-[3px] border-ink rounded-2xl overflow-hidden comic-shadow">
        <table className="w-full text-sm">
          <thead className="bg-ink text-secondary">
            <tr><th className="text-left p-3">Nama</th><th className="text-left p-3">Kategori</th><th className="text-right p-3">Harga</th><th className="text-right p-3">Stok</th><th className="p-3">Status</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {products?.map((p) => (
              <tr key={p.id} className="border-t-2 border-ink/10">
                <td className="p-3 font-bold">{p.name}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3 text-right">{formatIDR(p.price)}</td>
                <td className="p-3 text-right">{p.stock}</td>
                <td className="p-3 text-center">{p.is_active ? "✅" : "❌"}{p.is_featured && " ⭐"}</td>
                <td className="p-3 flex gap-1 justify-end">
                  <button onClick={() => setEditing({ ...p, description: p.description ?? "", image_url: p.image_url ?? "", category: p.category as any, is_active: p.is_active ?? true })} className="p-2 hover:bg-secondary rounded"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => { if (confirm("Hapus produk?")) delMut.mutate(p.id); }} className="p-2 hover:bg-primary hover:text-primary-foreground rounded"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {products?.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Belum ada produk.</td></tr>}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-ink/60 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="bg-background border-[3px] border-ink rounded-2xl p-6 comic-shadow-xl w-full max-w-lg space-y-3 max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-3xl">{editing.id ? "Edit Produk" : "Produk Baru"}</h2>
            <input required placeholder="Slug (cth: plush-luffy)" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className="w-full px-3 py-2 border-[3px] border-ink rounded-lg font-bold" />
            <input required placeholder="Nama" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full px-3 py-2 border-[3px] border-ink rounded-lg font-bold" />
            <textarea placeholder="Deskripsi" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full px-3 py-2 border-[3px] border-ink rounded-lg" />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" required placeholder="Harga" value={editing.price} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} className="px-3 py-2 border-[3px] border-ink rounded-lg font-bold" />
              <input type="number" required placeholder="Stok" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} className="px-3 py-2 border-[3px] border-ink rounded-lg font-bold" />
            </div>
            <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value as any })} className="w-full px-3 py-2 border-[3px] border-ink rounded-lg font-bold">
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <input placeholder="URL Gambar (cth: /products/foo.jpg)" value={editing.image_url} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} className="w-full px-3 py-2 border-[3px] border-ink rounded-lg" />
            <div className="flex gap-4">
              <label className="flex items-center gap-2 font-bold"><input type="checkbox" checked={editing.is_featured} onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })} /> Unggulan</label>
              <label className="flex items-center gap-2 font-bold"><input type="checkbox" checked={editing.is_active} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} /> Aktif</label>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="flex-1 px-4 py-2 border-[3px] border-ink rounded-lg font-black">Batal</button>
              <button type="submit" disabled={createMut.isPending || updateMut.isPending} className="flex-1 px-4 py-2 bg-primary text-primary-foreground border-[3px] border-ink rounded-lg font-black comic-shadow">Simpan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
