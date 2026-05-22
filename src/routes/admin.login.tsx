import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/login")({ component: AdminLogin });

function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin/dashboard" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin/dashboard` },
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Account created. Ask the admin to grant you the admin role in the database, then sign in.");
      setMode("signin");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Signed in");
    navigate({ to: "/admin/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background grid-bg">
      <form onSubmit={submit} className="w-full max-w-md card-tech p-8 space-y-4 relative z-10">
        <div className="font-mono text-xs text-cyan">// admin</div>
        <h1 className="font-display text-3xl font-bold">{mode === "signin" ? "Sign in" : "Create account"}</h1>
        <p className="text-sm text-muted-foreground">
          {mode === "signin" ? "Authenticate to manage portfolio content." : "First account: sign up, then grant the admin role from the backend."}
        </p>
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full px-5 py-3 rounded-full gradient-accent text-primary-foreground font-medium disabled:opacity-60"
        >
          {loading ? "..." : mode === "signin" ? "Sign in" : "Sign up"}
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full text-xs text-muted-foreground hover:text-cyan"
        >
          {mode === "signin" ? "Need to create the first admin account?" : "Already have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}