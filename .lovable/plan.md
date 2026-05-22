## Tujuan

Toko SUKEN jadi **semi online + offline**:

- **Customer** bisa daftar/login, browse, wishlist, dan buat pesanan online (konfirmasi via WhatsApp, tanpa pembayaran QRIS).
- **Admin** = kasir + manajer produk. Bisa CRUD produk, mencatat transaksi pelanggan walk-in, dan melihat semua pesanan online.

## Database (Supabase)

1. `**profiles**` — `id`, `user_id (FK auth.users)`, `full_name`, `phone`, `avatar_url`. Auto-create via trigger `handle_new_user`.
2. `**user_roles**` + enum `app_role` (`admin`, `customer`) + fungsi `has_role()` (security definer). Pakai pattern anti-recursion.
3. `**products**` — `id`, `slug`, `name`, `description`, `price`, `category`, `image_url`, `stock`, `is_featured`, `is_active`. Public read, admin write.
4. `**transactions**` — `id`, `order_number`, `customer_id (nullable)`, `customer_name`, `customer_phone`, `type` (`online` | `offline`), `status` (`pending`, `confirmed`, `completed`, `cancelled`), `subtotal`, `notes`, `created_by (admin id, untuk offline)`.
5. `**transaction_items**` — `id`, `transaction_id`, `product_id`, `product_name`, `qty`, `price`.
6. **Storage bucket** `product-images` (public read, admin write) untuk upload gambar produk.

RLS:

- `products`: semua boleh SELECT (publik), hanya admin INSERT/UPDATE/DELETE.
- `transactions`/`transaction_items`: customer lihat punya sendiri; admin lihat & ubah semua.
- `profiles`: user lihat/ubah punya sendiri; admin lihat semua.
- `user_roles`: user lihat punya sendiri; admin manage.

## Auth

- Email/password + Google (via Lovable broker + `configure_social_auth`).
- Auto-confirm email **off** (user verifikasi dulu).
- Akun admin: `rafi08akbar@gmail.com` — di-assign role `admin` lewat seed setelah signup.

## Halaman baru

- `/login`, `/signup`, `/reset-password`
- `/account` (customer): profil, daftar pesanan, wishlist.
- `/checkout` (customer): isi nama/phone/catatan → buat transaksi `online` status `pending` → redirect ke halaman sukses + tombol WhatsApp admin.
- `/admin` (admin only, dilindungi `_authenticated/_admin`):
  - **Dashboard**: ringkasan (total pesanan hari ini, omzet, pesanan pending).
  - **Produk**: tabel CRUD + upload gambar.
  - **Kasir (POS)**: pilih produk → tambah ke struk → input nama/phone (opsional) → simpan sebagai transaksi `offline` `completed`.
  - **Transaksi**: tabel semua transaksi (online + offline), filter status, klik untuk detail + ubah status.

## Perubahan kode

- `src/lib/products.ts`: ganti hardcoded jadi fetch dari Supabase via server function. Seed produk awal lewat migration.
- `src/components/Header.tsx`: tambah link Login/Akun + badge cart.
- Route guards: `_authenticated.tsx` + `_authenticated/_admin.tsx`.
- Server functions di `src/lib/*.functions.ts` untuk semua operasi DB (pakai `requireSupabaseAuth` / `has_role` check).

## Urutan eksekusi

1. Migration: tabel + RLS + trigger + seed produk.
2. Configure auth (email + Google).
3. Auth pages + route guards + header.
4. Customer account + checkout flow.
5. Admin dashboard (produk → POS → transaksi).
6. Assign role admin ke akun rafi setelah user signup pertama kali.

## Catatan

- Setelah migration jadi, kamu **signup dulu** pakai `rafi08akbar@gmail.com`, lalu aku jalankan insert untuk memberi role `admin`.
- ada integrasi pembayaran — konfirmasi & pelunasan tetap via WhatsApp / di ruko.

OK lanjut build?  
  
