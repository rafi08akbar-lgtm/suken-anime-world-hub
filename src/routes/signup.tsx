import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({ meta: [{ title: "Daftar — SUKEN" }] }),
});

function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName }, emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Akun dibuat! Kamu sudah masuk.");
    navigate({ to: "/" });
  };

  const google = async () => {
    const res = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (res.error) toast.error(res.error.message);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-card border-[3px] border-ink rounded-2xl p-8 comic-shadow-lg">
        <h1 className="font-display text-4xl text-primary text-stroke-thick text-center">DAFTAR</h1>
        <p className="text-center text-muted-foreground mt-1 text-sm">Sudah punya akun? <Link to="/login" className="font-black underline">Masuk</Link></p>

        <button onClick={google} className="mt-6 w-full bg-background border-[3px] border-ink rounded-lg py-3 font-black comic-shadow">
          Daftar dengan Google
        </button>
        <div className="my-4 text-center text-xs font-bold text-muted-foreground">atau pakai email</div>

        <form onSubmit={submit} className="space-y-3">
          <input required placeholder="Nama lengkap" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-3 bg-background border-[3px] border-ink rounded-lg font-bold" />
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-background border-[3px] border-ink rounded-lg font-bold" />
          <input type="password" required minLength={6} placeholder="Password (min 6 karakter)" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-background border-[3px] border-ink rounded-lg font-bold" />
          <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground border-[3px] border-ink rounded-lg py-3 font-black text-lg comic-shadow disabled:opacity-50">
            {loading ? "..." : "DAFTAR"}
          </button>
        </form>
      </div>
    </div>
  );
}
