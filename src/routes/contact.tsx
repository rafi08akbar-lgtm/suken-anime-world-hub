import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, MapPin, Clock, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({ meta: [{ title: "Kunjungi Ruko — SUKEN" }] }),
});

function Contact() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="font-display text-5xl md:text-6xl text-stroke-thick text-primary">MAMPIR KE RUKO KAMI!</h1>
      <p className="text-muted-foreground mt-2">
        Lihat, pegang, dan rasakan langsung koleksi anime kami. Tim SUKEN siap nemenin kamu pilih merch favorit.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="bg-card border-[3px] border-ink rounded-2xl p-6 comic-shadow-lg space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-7 h-7 text-primary shrink-0" />
            <div>
              <p className="font-display text-2xl">Alamat Ruko</p>
              <p className="text-sm font-bold">Ruko SUKEN, Jl. Otaku No. 9</p>
              <p className="text-sm">Jakarta Pusat, DKI Jakarta 10110</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-7 h-7 text-primary shrink-0" />
            <div>
              <p className="font-display text-2xl">Jam Buka</p>
              <p className="text-sm font-bold">Senin – Sabtu · 09:00 – 21:00 WIB</p>
              <p className="text-sm">Minggu · 10:00 – 18:00 WIB</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-7 h-7 text-primary shrink-0" />
            <div>
              <p className="font-display text-2xl">Telepon</p>
              <p className="text-sm font-bold">+62 812 3456 7890</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <a
            href="https://wa.me/6281234567890"
            className="flex items-center gap-4 bg-[#25D366] text-white border-[3px] border-ink rounded-2xl p-5 comic-shadow hover:translate-y-[-2px] transition-transform"
          >
            <MessageCircle className="w-8 h-8" />
            <div>
              <p className="font-display text-xl">WhatsApp Toko</p>
              <p className="text-sm">Tanya stok & reservasi merch</p>
            </div>
          </a>
          <div className="bg-secondary border-[3px] border-ink rounded-2xl p-5 comic-shadow">
            <p className="font-display text-xl text-ink">Cara ke Ruko</p>
            <p className="text-sm font-bold text-ink mt-1">
              Dekat halte TransJakarta Otaku Center. Parkir motor & mobil tersedia di depan ruko.
            </p>
          </div>
          <div className="aspect-video bg-ink/10 border-[3px] border-ink rounded-2xl flex items-center justify-center text-sm font-bold text-muted-foreground">
            🗺️ Peta lokasi akan tampil di sini
          </div>
        </div>
      </div>
    </div>
  );
}
