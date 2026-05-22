import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, HeadContent, Scripts, useRouter } from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import mascot from "@/assets/mascot.png";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        <img src={mascot} alt="Lost mascot" className="w-48 h-48 mx-auto animate-float" />
        <h1 className="text-7xl md:text-9xl font-display text-primary text-stroke-thick mt-4">404</h1>
        <h2 className="font-heading text-2xl font-bold mt-2">Halaman tidak ditemukan!</h2>
        <Link to="/" className="inline-block mt-6 bg-primary text-primary-foreground border-[3px] border-ink rounded-lg px-6 py-3 font-black comic-shadow">← Kembali ke Home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  console.error(error);
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-4xl text-primary text-stroke-thick">Ada yang error!</h1>
        <p className="mt-2 text-muted-foreground text-sm">{error.message}</p>
        <a href="/" className="inline-block mt-6 bg-secondary text-ink border-[3px] border-ink rounded-lg px-6 py-3 font-black comic-shadow">Ke Home</a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SUKEN — Toko Anime Merchandise Jakarta" },
      { name: "description", content: "Plush, cosplay, action figure & aksesoris anime. Online & offline di Jakarta." },
      { property: "og:title", content: "SUKEN — Toko Anime Merchandise Jakarta" },
      { name: "twitter:title", content: "SUKEN — Toko Anime Merchandise Jakarta" },
      { property: "og:description", content: "Plush, cosplay, action figure & aksesoris anime. Online & offline di Jakarta." },
      { name: "twitter:description", content: "Plush, cosplay, action figure & aksesoris anime. Online & offline di Jakarta." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/60ab0b2e-197f-46ec-81cd-a93f0724e4ec/id-preview-bc2d08bd--2f2df829-c96a-48c8-b297-e4cd961d666a.lovable.app-1779438145453.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/60ab0b2e-197f-46ec-81cd-a93f0724e4ec/id-preview-bc2d08bd--2f2df829-c96a-48c8-b297-e4cd961d666a.lovable.app-1779438145453.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function AuthListener() {
  const router = useRouter();
  const qc = useQueryClient();
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      router.invalidate();
      qc.invalidateQueries();
    });
    return () => subscription.unsubscribe();
  }, [router, qc]);
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthListener />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1"><Outlet /></main>
        <Footer />
        <WhatsAppButton />
        <Toaster position="bottom-center" toastOptions={{ style: { border: "3px solid #1A1A2E", borderRadius: "12px", fontWeight: 800, boxShadow: "4px 4px 0 0 #1A1A2E" } }} />
      </div>
    </QueryClientProvider>
  );
}
