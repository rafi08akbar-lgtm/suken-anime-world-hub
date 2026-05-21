import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({
  component: Blog,
  head: () => ({ meta: [{ title: "Blog — SUKEN" }] }),
});

const posts = [
  { slug: "1", title: "Top 10 Anime Plush of 2026", cat: "Review", excerpt: "We ranked the cuddliest, most collectible plush of the year.", emoji: "🧸" },
  { slug: "2", title: "Cosplay Tips for Beginners", cat: "Cosplay Tips", excerpt: "Don't burn yourself with the hot glue gun. And 9 other rules.", emoji: "🥷" },
  { slug: "3", title: "One Piece: The Wano Arc Hype", cat: "Anime News", excerpt: "Why every fan needs the Wano collection in their shelf.", emoji: "🏴‍☠️" },
  { slug: "4", title: "Unboxing: Super Saiyan Figure", cat: "Unboxing", excerpt: "We unbox the figure everyone is talking about.", emoji: "⚡" },
];

function Blog() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display text-5xl md:text-6xl text-stroke-thick text-primary">THE BLOG</h1>
      <p className="text-muted-foreground mt-2">Reviews, tips & anime news from the SUKEN crew.</p>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {posts.map((p) => (
          <Link
            key={p.slug}
            to="/blog"
            className="bg-card border-[3px] border-ink rounded-2xl overflow-hidden comic-shadow hover:comic-shadow-lg hover:-translate-y-1 hover:-translate-x-1 transition-all"
          >
            <div className="aspect-[2/1] bg-secondary flex items-center justify-center text-8xl border-b-[3px] border-ink">
              {p.emoji}
            </div>
            <div className="p-5">
              <span className="inline-block bg-primary text-primary-foreground text-xs font-black px-2 py-0.5 rounded-full border-2 border-ink -rotate-2">
                {p.cat}
              </span>
              <h2 className="font-display text-2xl mt-2">{p.title}</h2>
              <p className="text-muted-foreground mt-2 text-sm">{p.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
