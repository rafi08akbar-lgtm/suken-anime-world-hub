import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "react-hot-toast";

import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import mascot from "@/assets/mascot.png";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        <img src={mascot} alt="Lost mascot" className="w-48 h-48 mx-auto animate-float" />
        <h1 className="text-7xl md:text-9xl font-display text-primary text-stroke-thick mt-4">404</h1>
        <h2 className="font-heading text-2xl font-bold mt-2">This page went to another dimension!</h2>
        <p className="text-muted-foreground mt-2">Looks like this URL took a wrong portal. Let's get you home, hero.</p>
        <Link
          to="/"
          className="inline-block mt-6 bg-primary text-primary-foreground border-[3px] border-ink rounded-lg px-6 py-3 font-black comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          ← Back to HQ
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  console.error(error);
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-4xl text-primary text-stroke-thick">Something exploded!</h1>
        <p className="mt-2 text-muted-foreground">A wild bug appeared. Try refreshing.</p>
        <a href="/" className="inline-block mt-6 bg-secondary text-ink border-[3px] border-ink rounded-lg px-6 py-3 font-black comic-shadow">
          Go home
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SUKEN — Your Anime World, Delivered!" },
      { name: "description", content: "Plush dolls, cosplay outfits, action figures & anime accessories. Indonesia's #1 destination for all-age anime lovers." },
      { property: "og:title", content: "SUKEN — Your Anime World, Delivered!" },
      { property: "og:description", content: "Indonesia's energetic anime merchandise store." },
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
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <WhatsAppButton />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              border: "3px solid #1A1A2E",
              borderRadius: "12px",
              fontWeight: 800,
              boxShadow: "4px 4px 0 0 #1A1A2E",
            },
          }}
        />
      </div>
    </QueryClientProvider>
  );
}
