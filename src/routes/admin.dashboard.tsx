import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { FolderKanban, Sparkles, Mail, Trophy, User, Plus, Edit } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({ component: AdminDashboard });

function timeAgo(iso?: string | null) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function AdminDashboard() {
  const stats = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const [projects, skills, messages, unread, ach] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("skills").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("achievements").select("id", { count: "exact", head: true }),
      ]);
      return {
        projects: projects.count ?? 0, skills: skills.count ?? 0,
        messages: messages.count ?? 0, unread: unread.count ?? 0,
        achievements: ach.count ?? 0,
      };
    },
  });

  const recent = useQuery({
    queryKey: ["recentMessages"],
    queryFn: async () => (await supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(3)).data ?? [],
  });

  const profile = useQuery({
    queryKey: ["profileCompletion"],
    queryFn: async () => (await supabase.from("profile").select("*").limit(1).maybeSingle()).data,
  });

  const completion = (() => {
    const p = profile.data; if (!p) return 0;
    const fields = ["name", "title", "summary", "email", "phone", "location", "github_url", "linkedin_url", "profile_photo_url", "resume_url"] as const;
    const filled = fields.filter((f) => !!(p as any)[f]).length;
    return Math.round((filled / fields.length) * 100);
  })();

  const statCards = [
    { label: "Projects", value: stats.data?.projects ?? 0, icon: FolderKanban },
    { label: "Skills", value: stats.data?.skills ?? 0, icon: Sparkles },
    { label: "Achievements", value: stats.data?.achievements ?? 0, icon: Trophy },
    { label: "Messages", value: stats.data?.messages ?? 0, icon: Mail, badge: stats.data?.unread },
  ];

  const quick = [
    { to: "/admin/projects/$id", params: { id: "new" }, label: "Add Project", icon: Plus },
    { to: "/admin/profile", label: "Edit Profile", icon: Edit },
    { to: "/admin/skills", label: "Manage Skills", icon: Sparkles },
    { to: "/admin/achievements", label: "Add Achievement", icon: Trophy },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="font-mono text-xs text-cyan mb-2">// overview</div>
      <p className="text-muted-foreground mb-8">Manage every section of your portfolio from here.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="card-tech p-5">
              <div className="flex items-start justify-between mb-3">
                <Icon className="text-cyan" size={18} />
                {c.badge ? <span className="text-[10px] bg-cyan text-primary-foreground rounded-full px-2 py-0.5 font-bold">{c.badge} new</span> : null}
              </div>
              <div className="font-display text-3xl font-bold">{c.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 card-tech p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-semibold">Recent Messages</h2>
            <Link to="/admin/messages" className="text-xs text-cyan hover:underline">View all →</Link>
          </div>
          {!recent.data?.length ? (
            <div className="text-sm text-muted-foreground py-6 text-center">No messages yet.</div>
          ) : (
            <div className="space-y-3">
              {recent.data.map((m: any) => (
                <div key={m.id} className={`p-3 rounded-lg border ${!m.is_read ? "border-cyan/40 bg-cyan/5" : "border-border"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm ${!m.is_read ? "font-bold" : ""}`}>{m.name}</span>
                    <span className="text-xs text-muted-foreground">{m.email}</span>
                    <span className="ml-auto text-[10px] font-mono text-muted-foreground">{timeAgo(m.created_at)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-tech p-5">
          <h2 className="font-display text-base font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {quick.map((q) => {
              const Icon = q.icon;
              return (
                <Link key={q.label} to={q.to as any} params={q.params as any} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm hover:border-cyan hover:text-cyan transition-colors">
                  <Icon size={14} /> {q.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card-tech p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <User size={16} className="text-cyan" />
            <h2 className="font-display text-base font-semibold">Profile Completion</h2>
          </div>
          <span className="text-cyan font-mono text-sm">{completion}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full gradient-accent transition-all" style={{ width: `${completion}%` }} />
        </div>
        {completion < 100 && (
          <Link to="/admin/profile" className="inline-block mt-3 text-xs text-cyan hover:underline">Complete your profile →</Link>
        )}
      </div>
    </AdminLayout>
  );
}