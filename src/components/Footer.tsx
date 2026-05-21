import { Link } from "@tanstack/react-router";
import { Instagram, Youtube, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ink text-background mt-20 border-t-[6px] border-primary">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-3xl font-display text-secondary text-stroke-thick mb-3">SUKEN</h3>
          <p className="text-sm opacity-80">Your Anime World, Delivered! The #1 anime merchandise destination in Indonesia.</p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:rotate-6 transition-transform">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:rotate-6 transition-transform">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:rotate-6 transition-transform">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-display text-xl text-secondary mb-3">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-secondary">All Products</Link></li>
            <li><Link to="/shop" className="hover:text-secondary">Plush Dolls</Link></li>
            <li><Link to="/shop" className="hover:text-secondary">Cosplay</Link></li>
            <li><Link to="/shop" className="hover:text-secondary">Figures</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-xl text-secondary mb-3">Help</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/contact" className="hover:text-secondary">Contact HQ</Link></li>
            <li><a href="#" className="hover:text-secondary">Shipping Info</a></li>
            <li><a href="#" className="hover:text-secondary">Returns</a></li>
            <li><a href="#" className="hover:text-secondary">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-xl text-secondary mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-secondary">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-secondary">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-secondary">Refund Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/20 py-4 text-center text-xs opacity-70">
        © {new Date().getFullYear()} SUKEN. Powered by anime passion. 🌟
      </div>
    </footer>
  );
}
