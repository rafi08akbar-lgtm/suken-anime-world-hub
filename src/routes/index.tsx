import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Zap, Truck, ShieldCheck, Star } from "lucide-react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { CATEGORIES } from "@/lib/products";
import { listProducts } from "@/lib/products.functions";
import { ProductCard } from "@/components/ProductCard";
import heroBg from "@/assets/hero-bg.jpg";
import mascot from "@/assets/mascot.png";

const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: Home,
  head: () => ({
    meta: [
      { title: "SUKEN — Toko Anime Merchandise Jakarta" },
      { name: "description", content: "Plush, cosplay, action figure & aksesoris anime. Belanja online atau mampir ke ruko kami di Jakarta." },
    ],
  }),
});

const tickerItems = [
  "🔥 KOLEKSI BARU: One Piece Wano",
  "📍 Mampir ke ruko kami di Jakarta",
  "🛒 Bisa pesan online — diantar / ambil di ruko",
  "🥷 Cosplay Naruto sudah restock!",
  "⭐ Action figure Saiyan limited — sisa 5",
];

function Home() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const featured = products.slice(0, 4);

  return (
    <div>
      <section className="relative overflow-hidden border-b-[3px] border-ink">
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 halftone opacity-[0.08]" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 80 }}>
            <span className="inline-block bg-secondary border-[3px] border-ink px-3 py-1 rounded-full text-sm font-black -rotate-3 comic-shadow">
              ⚡ POWERED BY PURE ANIME ENERGY
            </span>
            <h1 className="font-display text-6xl md:text-8xl leading-[0.9] mt-4 text-ink">
              UNLEASH<br />
              YOUR <span className="text-primary text-stroke-thick">INNER</span><br />
              <span className="text-primary text-stroke-thick">OTAKU!</span>
            </h1>
            <p className="mt-4 text-lg max-w-md text-muted-foreground">
              Pesan online & diantar, atau mampir langsung ke ruko kami di Jakarta untuk lihat barangnya.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to="/shop" className="bg-primary text-primary-foreground border-[3px] border-ink rounded-lg px-6 py-3 font-black text-lg comic-shadow-lg hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all">
                BELANJA SEKARANG →
              </Link>
              <Link to="/contact" className="bg-secondary text-ink border-[3px] border-ink rounded-lg px-6 py-3 font-black text-lg comic-shadow-lg hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all">
                KUNJUNGI RUKO
              </Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.7, rotate: -10 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 100, delay: 0.2 }} className="relative flex justify-center">
            <div className="absolute inset-0 bg-secondary rounded-full blur-3xl opacity-50" />
            <img src={mascot} alt="SUKEN mascot" className="relative w-72 md:w-96 animate-float" />
          </motion.div>
        </div>
      </section>

      <section className="bg-ink text-secondary py-3 overflow-hidden border-b-[3px] border-ink">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((t, i) => (
            <span key={i} className="mx-8 font-black uppercase tracking-wider text-sm">
              {t} <span className="text-primary ml-8">✦</span>
            </span>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-5xl text-stroke-thick text-secondary">PICK YOUR ARMOR</h2>
          <p className="text-muted-foreground mt-2">Pilih kategori dan siapkan dirimu!</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Link
                to="/shop"
                search={{ cat: c.id }}
                className={`block aspect-square border-[3px] border-ink rounded-2xl p-5 comic-shadow hover:comic-shadow-xl hover:-translate-y-1 hover:-translate-x-1 transition-all ${
                  i % 2 === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-ink"
                }`}
              >
                <div className="text-5xl md:text-6xl">{c.emoji}</div>
                <h3 className="font-display text-2xl md:text-3xl mt-3">{c.label}</h3>
                <p className="text-sm font-bold mt-1 opacity-90">{c.tagline}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-surface border-y-[3px] border-ink py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <h2 className="font-display text-5xl text-stroke-thick text-primary">HOT DROPS 🔥</h2>
              <p className="text-muted-foreground mt-2">Pilihan favorit para fans</p>
            </div>
            <Link to="/shop" className="font-black underline decoration-primary decoration-4 underline-offset-4 hover:text-primary">
              Lihat semua →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-display text-5xl text-stroke-thick text-secondary text-center mb-12">WHY SUKEN?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: "100% Original", desc: "Semua figure, plush & kostum berlisensi resmi." },
            { icon: Truck, title: "Online & Offline", desc: "Pesan online dari rumah, atau datang langsung ke ruko." },
            { icon: Zap, title: "Direkomendasi Otaku", desc: "Dikurasi oleh fans anime sejati." },
          ].map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-card border-[3px] border-ink rounded-2xl p-6 comic-shadow text-center">
              <div className="w-16 h-16 mx-auto bg-primary text-primary-foreground rounded-full border-[3px] border-ink flex items-center justify-center mb-4">
                <f.icon className="w-8 h-8" strokeWidth={2.5} />
              </div>
              <h3 className="font-display text-2xl">{f.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-background py-16 border-y-[3px] border-ink">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-5xl text-stroke-thick text-secondary text-center mb-12">FAN VOICES</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Rina S.", text: "Plush-nya super fluffy! Sampai 2 hari aja. SUKEN auto langganan.", avatar: "🌸" },
              { name: "Bagas P.", text: "Beli Saiyan figure di sini — qualitynya gila, lebih murah dari convention!", avatar: "⚡" },
              { name: "Yuki M.", text: "Cosplay set pas banget, bahan awet. 10/10 bakal beli lagi.", avatar: "🎀" },
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="bg-card text-card-foreground border-[3px] border-secondary rounded-2xl p-6 relative">
                <div className="absolute -top-4 left-4 bg-secondary text-ink border-[3px] border-ink rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                  {t.avatar}
                </div>
                <div className="flex gap-0.5 mt-4 mb-2">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-secondary text-secondary" />)}
                </div>
                <p className="text-sm leading-relaxed">"{t.text}"</p>
                <p className="font-black mt-3">— {t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
