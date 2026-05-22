import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingCart, Heart, Search, Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useCart } from "@/lib/store";
import { useSession, useMyRole } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const count = useCart((s) => s.count());
  const wishCount = useCart((s) => s.wishlist.length);
  const [open, setOpen] = useState(false);
  const { session } = useSession();
  const { data: role } = useMyRole(!!session);
  const navigate = useNavigate();

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Sampai jumpa!");
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b-[3px] border-ink">
      <div className="bg-ink text-secondary text-xs font-bold py-1.5 text-center uppercase tracking-wider">
        📍 Ruko SUKEN · Jl. Otaku No. 9, Jakarta · Buka 09:00–21:00 WIB
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="relative">
            <span className="text-3xl md:text-4xl font-display text-primary text-stroke-thick block leading-none">SUKEN</span>
            <span className="absolute -top-2 -right-3 bg-secondary border-2 border-ink rounded-full w-5 h-5 flex items-center justify-center text-[10px] rotate-12 group-hover:rotate-45 transition-transform">⭐</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 font-heading font-bold">
          {[{ to: "/", label: "Home" }, { to: "/shop", label: "Shop" }, { to: "/contact", label: "Contact" }].map((l) => (
            <Link key={l.to} to={l.to} className="px-4 py-2 hover:bg-secondary hover:-rotate-2 transition-transform rounded-lg" activeProps={{ className: "bg-primary text-primary-foreground" }} activeOptions={{ exact: l.to === "/" }}>
              {l.label}
            </Link>
          ))}
          {role?.isAdmin && (
            <Link to="/admin" className="px-4 py-2 bg-ink text-secondary rounded-lg flex items-center gap-1">
              <LayoutDashboard className="w-4 h-4" /> Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/shop" className="hidden md:flex items-center justify-center w-10 h-10 hover:bg-secondary rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </Link>
          <button className="relative w-10 h-10 flex items-center justify-center hover:bg-secondary rounded-lg transition-colors">
            <Heart className="w-5 h-5" />
            {wishCount > 0 && <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-ink">{wishCount}</span>}
          </button>

          {session ? (
            <>
              <Link to="/account" className="hidden md:flex items-center gap-1 px-3 h-10 bg-card border-[3px] border-ink rounded-lg font-black comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                <User className="w-4 h-4" /> Akun
              </Link>
              <button onClick={logout} className="hidden md:flex items-center justify-center w-10 h-10 hover:bg-secondary rounded-lg" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <Link to="/login" className="hidden md:flex items-center gap-1 px-3 h-10 bg-card border-[3px] border-ink rounded-lg font-black comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
              <User className="w-4 h-4" /> Masuk
            </Link>
          )}

          <Link to="/cart" className="relative bg-primary text-primary-foreground border-[3px] border-ink rounded-lg px-3 h-10 flex items-center gap-2 font-black comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && <span className="bg-secondary text-ink text-xs font-black rounded-full w-6 h-6 flex items-center justify-center border-2 border-ink animate-pop-in">{count}</span>}
          </Link>
          <button onClick={() => setOpen(!open)} className="lg:hidden w-10 h-10 flex items-center justify-center">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t-[3px] border-ink bg-background">
          <nav className="flex flex-col p-4 gap-2 font-heading font-bold">
            {[{ to: "/", label: "Home" }, { to: "/shop", label: "Shop" }, { to: "/contact", label: "Contact" }].map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="px-4 py-3 bg-surface border-2 border-ink rounded-lg">{l.label}</Link>
            ))}
            {session ? (
              <>
                <Link to="/account" onClick={() => setOpen(false)} className="px-4 py-3 bg-surface border-2 border-ink rounded-lg">Akun Saya</Link>
                {role?.isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="px-4 py-3 bg-ink text-secondary border-2 border-ink rounded-lg">Admin Panel</Link>}
                <button onClick={() => { setOpen(false); logout(); }} className="px-4 py-3 bg-surface border-2 border-ink rounded-lg text-left">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="px-4 py-3 bg-primary text-primary-foreground border-2 border-ink rounded-lg">Masuk / Daftar</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
