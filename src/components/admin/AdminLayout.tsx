import { ReactNode, useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard, User, FolderKanban, Sparkles, Briefcase,
  Images, Trophy, Mail, LogOut, Shield, ExternalLink,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const nav = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/profile", label: "Profile", icon: User },
  { to: "/admin/projects", label: "Projects", icon: FolderKanban },
  { to: "/admin/skills", label: "Skills", icon: Sparkles },
  { to: "/admin/experience", label: "Experience", icon: Briefcase },
  { to: "/admin/gallery", label: "Gallery", icon: Images },
  { to: "/admin/achievements", label: "Achievements", icon: Trophy },
  { to: "/admin/messages", label: "Messages", icon: Mail },
];

export function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [userId, setUserId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/admin/login" });
      else setUserId(data.session.user.id);
      setChecked(true);
    });
  }, [navigate]);

  const isAdmin = useQuery({
    queryKey: ["isAdmin", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase
        .from("user_roles").select("role")
        .eq("user_id", userId!).eq("role", "admin").maybeSingle();
      return !!data;
    },
  });

  const unread = useQuery({
    queryKey: ["unreadCount"],
    enabled: isAdmin.data === true,
    refetchInterval: 30000,
    queryFn: async () => {
      const { count } = await supabase
        .from("contact_messages").select("id", { count: "exact", head: true })
        .eq("is_read", false);
      return count ?? 0;
    },
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/admin/login" });
  };

  if (!checked || isAdmin.isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (isAdmin.data === false) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="card-tech p-8 max-w-md text-center">
          <Shield className="mx-auto text-cyan mb-4" />
          <h1 className="font-display text-2xl font-bold mb-3">Admin role required</h1>
          <p className="text-sm text-muted-foreground mb-2">Your account isn't an admin yet.</p>
          <p className="text-xs font-mono text-muted-foreground/70 mb-6 break-all">user_id: {userId}</p>
          <pre className="text-[11px] font-mono bg-background border border-border rounded p-3 text-left text-cyan mb-6 overflow-x-auto">
{`INSERT INTO public.user_roles (user_id, role)
VALUES ('${userId}', 'admin');`}
          </pre>
          <button onClick={signOut} className="text-xs text-muted-foreground hover:text-cyan">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-60 border-r border-border bg-card/30 flex flex-col fixed inset-y-0 left-0">
        <Link to="/" className="h-16 flex items-center px-5 border-b border-border">
          <span className="font-display font-bold text-cyan text-glow">YS</span>
          <span className="ml-2 text-xs font-mono text-muted-foreground">·admin</span>
        </Link>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to || (item.to !== "/admin/dashboard" && pathname.startsWith(item.to));
            const showBadge = item.to === "/admin/messages" && (unread.data ?? 0) > 0;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  active ? "bg-cyan/10 text-cyan border border-cyan/30" : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                <span className="flex-1">{item.label}</span>
                {showBadge && (
                  <span className="text-[10px] bg-cyan text-primary-foreground rounded-full px-1.5 py-0.5 font-bold min-w-[18px] text-center">
                    {unread.data}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-cyan">
            <ExternalLink size={14} /> View site
          </a>
          <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-cyan">
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-60 min-h-screen">
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center px-8 sticky top-0 z-10">
          <h1 className="font-display text-xl font-bold">{title}</h1>
        </header>
        <div className="p-8 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}