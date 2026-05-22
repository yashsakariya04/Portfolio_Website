import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dashboard")({ component: AdminDashboard });

function AdminDashboard() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/admin/login" });
      else setUserId(data.session.user.id);
    });
  }, [navigate]);

  const isAdmin = useQuery({
    queryKey: ["isAdmin", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId!).eq("role", "admin").maybeSingle();
      return !!data;
    },
  });

  const stats = useQuery({
    queryKey: ["adminStats"],
    enabled: isAdmin.data === true,
    queryFn: async () => {
      const [projects, skills, messages, unread] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("skills").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
      ]);
      return {
        projects: projects.count ?? 0,
        skills: skills.count ?? 0,
        messages: messages.count ?? 0,
        unread: unread.count ?? 0,
      };
    },
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/admin/login" });
  };

  if (isAdmin.isLoading || !userId) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (isAdmin.data === false) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="card-tech p-8 max-w-md text-center">
          <Shield className="mx-auto text-cyan mb-4" />
          <h1 className="font-display text-2xl font-bold mb-3">Admin role required</h1>
          <p className="text-sm text-muted-foreground mb-2">
            Your account exists but isn't an admin yet.
          </p>
          <p className="text-xs font-mono text-muted-foreground/70 mb-6 break-all">
            user_id: {userId}
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            Open the backend SQL editor and run:
          </p>
          <pre className="text-[11px] font-mono bg-background border border-border rounded p-3 text-left text-cyan mb-6 overflow-x-auto">
{`INSERT INTO public.user_roles (user_id, role)
VALUES ('${userId}', 'admin');`}
          </pre>
          <button onClick={signOut} className="text-xs text-muted-foreground hover:text-cyan">
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display font-bold text-cyan">YS · Admin</Link>
          <button onClick={signOut} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-cyan">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="font-mono text-xs text-cyan mb-2">// dashboard</div>
        <h1 className="font-display text-3xl font-bold mb-8">Welcome back, admin</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Stat label="Projects" value={stats.data?.projects} />
          <Stat label="Skills" value={stats.data?.skills} />
          <Stat label="Messages" value={stats.data?.messages} />
          <Stat label="Unread" value={stats.data?.unread} highlight />
        </div>
        <div className="card-tech p-6">
          <h2 className="font-display text-xl font-semibold mb-2">CMS coming next</h2>
          <p className="text-sm text-muted-foreground">
            Full CRUD pages for profile, projects, skills, experience, gallery, achievements, and messages will land in the next pass. The database, RLS, storage buckets, and auth are all live.
          </p>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value?: number; highlight?: boolean }) {
  return (
    <div className={`card-tech p-5 ${highlight ? "border-cyan glow-cyan" : ""}`}>
      <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
      <div className={`font-display text-3xl font-bold ${highlight ? "text-cyan text-glow" : ""}`}>{value ?? "—"}</div>
    </div>
  );
}