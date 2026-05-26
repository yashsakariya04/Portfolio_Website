import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { FolderKanban, Sparkles, Mail, Trophy, Briefcase, User } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({ component: AdminDashboard });

function AdminDashboard() {
  const stats = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const [projects, skills, messages, unread, exp, ach] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("skills").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("experience").select("id", { count: "exact", head: true }),
        supabase.from("achievements").select("id", { count: "exact", head: true }),
      ]);
      return {
        projects: projects.count ?? 0, skills: skills.count ?? 0,
        messages: messages.count ?? 0, unread: unread.count ?? 0,
        experience: exp.count ?? 0, achievements: ach.count ?? 0,
      };
    },
  });

  const cards = [
    { to: "/admin/profile", label: "Edit profile", icon: User, color: "text-cyan" },
    { to: "/admin/projects", label: "Projects", icon: FolderKanban, value: stats.data?.projects },
    { to: "/admin/skills", label: "Skills", icon: Sparkles, value: stats.data?.skills },
    { to: "/admin/experience", label: "Experience", icon: Briefcase, value: stats.data?.experience },
    { to: "/admin/achievements", label: "Achievements", icon: Trophy, value: stats.data?.achievements },
    { to: "/admin/messages", label: "Messages", icon: Mail, value: stats.data?.messages, badge: stats.data?.unread },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="font-mono text-xs text-cyan mb-2">// overview</div>
      <p className="text-muted-foreground mb-8">Manage every section of your portfolio from here.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link key={c.to} to={c.to} className="card-tech p-5 hover:border-cyan transition-colors group">
              <div className="flex items-start justify-between mb-3">
                <Icon className="text-cyan" size={20} />
                {c.badge ? <span className="text-[10px] bg-cyan text-primary-foreground rounded-full px-2 py-0.5 font-bold">{c.badge} new</span> : null}
              </div>
              <div className="font-display text-2xl font-bold mb-1">{c.value ?? ""}</div>
              <div className="text-sm text-muted-foreground group-hover:text-cyan transition-colors">{c.label} →</div>
            </Link>
          );
        })}
      </div>
    </AdminLayout>
  );
}