import { Link } from "@tanstack/react-router";
import { MapPin, Clock, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ink text-background mt-20 border-t-[6px] border-primary">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-3xl font-display text-secondary text-stroke-thick mb-3">SUKEN</h3>
          <p className="text-sm opacity-80">
            Ruko anime favoritmu di Indonesia. Mampir, lihat langsung, dan bawa pulang merchandise idolamu!
          </p>
        </div>
        <div>
          <h4 className="font-display text-xl text-secondary mb-3">Katalog</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-secondary">Semua Produk</Link></li>
            <li><Link to="/shop" className="hover:text-secondary">Plush Doll</Link></li>
            <li><Link to="/shop" className="hover:text-secondary">Cosplay</Link></li>
            <li><Link to="/shop" className="hover:text-secondary">Action Figure</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-xl text-secondary mb-3">Kunjungi Toko</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" /> Ruko SUKEN, Jl. Otaku No. 9, Jakarta</li>
            <li className="flex gap-2"><Clock className="w-4 h-4 mt-0.5 text-primary shrink-0" /> Senin–Sabtu · 09:00–21:00 WIB</li>
            <li className="flex gap-2"><Phone className="w-4 h-4 mt-0.5 text-primary shrink-0" /> +62 812 3456 7890</li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-xl text-secondary mb-3">Info</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/contact" className="hover:text-secondary">Hubungi Kami</Link></li>
            <li><Link to="/blog" className="hover:text-secondary">Blog</Link></li>
            <li><a href="#" className="hover:text-secondary">Syarat & Ketentuan</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/20 py-4 text-center text-xs opacity-70">
        © {new Date().getFullYear()} SUKEN. Dibuat dengan semangat anime. 🌟
      </div>
    </footer>
  );
}
