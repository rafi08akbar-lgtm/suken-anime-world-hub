import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import toast from "react-hot-toast";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({ meta: [{ title: "Contact HQ — SUKEN" }] }),
});

function Contact() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display text-5xl md:text-6xl text-stroke-thick text-primary">SEND A MESSAGE TO HQ!</h1>
      <p className="text-muted-foreground mt-2">Got a question, a wild request, or just want to chat anime? Our crew has your back.</p>

      <div className="grid md:grid-cols-2 gap-8 mt-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Message sent! HQ will reply ASAP. 🎉");
            (e.target as HTMLFormElement).reset();
          }}
          className="bg-card border-[3px] border-ink rounded-2xl p-6 comic-shadow-lg space-y-4"
        >
          <input required placeholder="Your name" className="w-full px-4 py-3 border-[3px] border-ink rounded-lg font-bold bg-background" />
          <input required type="email" placeholder="Email address" className="w-full px-4 py-3 border-[3px] border-ink rounded-lg font-bold bg-background" />
          <input placeholder="Phone (optional)" className="w-full px-4 py-3 border-[3px] border-ink rounded-lg font-bold bg-background" />
          <textarea required rows={5} placeholder="Drop your message..." className="w-full px-4 py-3 border-[3px] border-ink rounded-lg font-bold bg-background resize-none" />
          <button className="w-full bg-primary text-primary-foreground border-[3px] border-ink rounded-lg py-3 font-black text-lg comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            SEND IT! 🚀
          </button>
        </form>

        <div className="space-y-4">
          <a href="https://wa.me/6281234567890" className="flex items-center gap-4 bg-[#25D366] text-white border-[3px] border-ink rounded-2xl p-5 comic-shadow hover:translate-y-[-2px] transition-transform">
            <MessageCircle className="w-8 h-8" />
            <div>
              <p className="font-display text-xl">WhatsApp</p>
              <p className="text-sm">+62 812 3456 7890</p>
            </div>
          </a>
          <a href="mailto:hq@suken.id" className="flex items-center gap-4 bg-card border-[3px] border-ink rounded-2xl p-5 comic-shadow hover:translate-y-[-2px] transition-transform">
            <Mail className="w-8 h-8 text-primary" />
            <div>
              <p className="font-display text-xl">Email</p>
              <p className="text-sm">hq@suken.id</p>
            </div>
          </a>
          <div className="flex items-center gap-4 bg-secondary border-[3px] border-ink rounded-2xl p-5 comic-shadow">
            <MapPin className="w-8 h-8 text-ink" />
            <div>
              <p className="font-display text-xl">Store Hours</p>
              <p className="text-sm font-bold">Mon-Sat · 09:00-21:00 WIB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
