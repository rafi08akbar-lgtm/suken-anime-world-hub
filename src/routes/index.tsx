import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Zap, Truck, ShieldCheck, Star } from "lucide-react";
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import heroBg from "@/assets/hero-bg.jpg";
import mascot from "@/assets/mascot.png";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "SUKEN — Your Anime World, Delivered!" },
      { name: "description", content: "Shop authentic anime plush, cosplay, figures & accessories. Free shipping across Indonesia." },
    ],
  }),
});

const tickerItems = [
  "🔥 NEW DROP: One Piece Wano Collection",
  "⚡ Free shipping over Rp 500k",
  "🎁 Buy 2 plush, get 1 keychain FREE",
  "🥷 Naruto cosplay restocked!",
  "⭐ Limited Saiyan figures — only 5 left",
];

function Home() {
  const featured = PRODUCTS.slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b-[3px] border-ink">
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 halftone opacity-[0.08]" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 80 }}
          >
            <span className="inline-block bg-secondary border-[3px] border-ink px-3 py-1 rounded-full text-sm font-black -rotate-3 comic-shadow">
              ⚡ POWERED BY PURE ANIME ENERGY
            </span>
            <h1 className="font-display text-6xl md:text-8xl leading-[0.9] mt-4 text-ink">
              UNLEASH<br />
              YOUR <span className="text-primary text-stroke-thick">INNER</span><br />
              <span className="text-primary text-stroke-thick">OTAKU!</span>
            </h1>
            <p className="mt-4 text-lg max-w-md text-muted-foreground">
              Plush dolls, cosplay sets, action figures & accessories — straight from your favorite anime worlds to your door in Indonesia.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                to="/shop"
                className="bg-primary text-primary-foreground border-[3px] border-ink rounded-lg px-6 py-3 font-black text-lg comic-shadow-lg hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
              >
                SHOP NOW →
              </Link>
              <Link
                to="/shop"
                className="bg-secondary text-ink border-[3px] border-ink rounded-lg px-6 py-3 font-black text-lg comic-shadow-lg hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
              >
                NEW DROPS
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="absolute inset-0 bg-secondary rounded-full blur-3xl opacity-50" />
            <img src={mascot} alt="SUKEN mascot" className="relative w-72 md:w-96 animate-float" />
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="bg-ink text-secondary py-3 overflow-hidden border-b-[3px] border-ink">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...tickerItems, ...tickerItems].map((t, i) => (
            <span key={i} className="mx-8 font-black uppercase tracking-wider text-sm">
              {t} <span className="text-primary ml-8">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-5xl text-stroke-thick text-secondary">PICK YOUR ARMOR</h2>
          <p className="text-muted-foreground mt-2">Choose your category and gear up, hero!</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
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

      {/* FEATURED */}
      <section className="bg-surface border-y-[3px] border-ink py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <h2 className="font-display text-5xl text-stroke-thick text-primary">HOT DROPS 🔥</h2>
              <p className="text-muted-foreground mt-2">Fan favorites flying off the shelves</p>
            </div>
            <Link to="/shop" className="font-black underline decoration-primary decoration-4 underline-offset-4 hover:text-primary">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY SUKEN */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="font-display text-5xl text-stroke-thick text-secondary text-center mb-12">WHY SUKEN?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: "100% Original", desc: "Every figure, plush & garment is officially licensed and anime-guaranteed." },
            { icon: Truck, title: "Express Delivery", desc: "Ships nationwide from Jakarta — most orders arrive in 2-3 days." },
            { icon: Zap, title: "Otaku-Approved", desc: "Curated by hardcore fans for hardcore fans. We know our anime." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border-[3px] border-ink rounded-2xl p-6 comic-shadow text-center"
            >
              <div className="w-16 h-16 mx-auto bg-primary text-primary-foreground rounded-full border-[3px] border-ink flex items-center justify-center mb-4">
                <f.icon className="w-8 h-8" strokeWidth={2.5} />
              </div>
              <h3 className="font-display text-2xl">{f.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-ink text-background py-16 border-y-[3px] border-ink">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-5xl text-stroke-thick text-secondary text-center mb-12">FAN VOICES</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Rina S.", text: "The plush is so fluffy! Arrived in 2 days. SUKEN is my new go-to.", avatar: "🌸" },
              { name: "Bagas P.", text: "Got the Saiyan figure — quality blew my mind. Better than the convention price!", avatar: "⚡" },
              { name: "Yuki M.", text: "Cosplay set fit perfectly and the fabric is durable. 10/10 will buy again.", avatar: "🎀" },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-card text-card-foreground border-[3px] border-secondary rounded-2xl p-6 relative"
              >
                <div className="absolute -top-4 left-4 bg-secondary text-ink border-[3px] border-ink rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                  {t.avatar}
                </div>
                <div className="flex gap-0.5 mt-4 mb-2">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed">"{t.text}"</p>
                <p className="font-black mt-3">— {t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-primary text-primary-foreground border-[3px] border-ink rounded-2xl p-8 md:p-12 comic-shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary rounded-full opacity-30" />
          <div className="relative text-center">
            <h2 className="font-display text-5xl">JOIN THE GUILD!</h2>
            <p className="mt-3 max-w-md mx-auto">Get first dibs on new drops, exclusive discounts & anime news every Friday.</p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-background text-foreground border-[3px] border-ink rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button className="bg-secondary text-ink border-[3px] border-ink rounded-lg px-6 py-3 font-black comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                JOIN!
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
