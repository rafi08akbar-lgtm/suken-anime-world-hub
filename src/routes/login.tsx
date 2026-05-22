import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import toast from "react-hot-toast";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  component: LoginPage,
  head: () => ({ meta: [{ title: "Masuk — SUKEN" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect: redirectTo } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Selamat datang kembali!");
    navigate({ to: (redirectTo as any) || "/" });
  };

  const google = async () => {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) toast.error(res.error.message);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-card border-[3px] border-ink rounded-2xl p-8 comic-shadow-lg">
        <h1 className="font-display text-4xl text-primary text-stroke-thick text-center">MASUK</h1>
        <p className="text-center text-muted-foreground mt-1 text-sm">Belum punya akun? <Link to="/signup" className="font-black underline">Daftar dulu</Link></p>

        <button onClick={google} className="mt-6 w-full bg-background border-[3px] border-ink rounded-lg py-3 font-black comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
          Lanjut dengan Google
        </button>
        <div className="my-4 text-center text-xs font-bold text-muted-foreground">atau pakai email</div>

        <form onSubmit={submit} className="space-y-3">
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-background border-[3px] border-ink rounded-lg font-bold" />
          <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-background border-[3px] border-ink rounded-lg font-bold" />
          <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground border-[3px] border-ink rounded-lg py-3 font-black text-lg comic-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50">
            {loading ? "..." : "MASUK"}
          </button>
        </form>
      </div>
    </div>
  );
}
