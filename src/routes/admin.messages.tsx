import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Mail, Check, Trash2, Reply, Filter } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { btnDanger } from "@/components/admin/Fields";

export const Route = createFileRoute("/admin/messages")({ component: MessagesAdmin });

const TYPES = ["All Types", "Opportunity", "Collaboration", "Freelance", "General"];
const STATUSES = ["All", "Unread", "Read"] as const;

function timeAgo(iso?: string | null) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

const typeColors: Record<string, string> = {
  Opportunity: "text-cyan border-cyan/40",
  Collaboration: "text-purple-400 border-purple-400/40",
  Freelance: "text-amber-400 border-amber-400/40",
  General: "text-muted-foreground border-border",
};

function MessagesAdmin() {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["adminMessages"],
    queryFn: async () => (await supabase.from("contact_messages").select("*").order("created_at", { ascending: false })).data ?? [],
    refetchInterval: 20000,
  });
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");
  const [type, setType] = useState("All Types");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const filtered = (data ?? []).filter((m) =>
    (status === "All" || (status === "Unread" ? !m.is_read : m.is_read)) &&
    (type === "All Types" || (m.message_type ?? "General") === type)
  );

  const markRead = async (id: string) => {
    const { error } = await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    if (error) return toast.error(error.message);
    refetch();
  };
  const del = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); refetch();
  };

  return (
    <AdminLayout title="Messages">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex gap-1">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs ${status === s ? "bg-cyan text-primary-foreground" : "border border-border text-muted-foreground hover:border-cyan"}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Filter size={12} className="text-muted-foreground" />
          <select value={type} onChange={(e) => setType(e.target.value)}
            className="bg-background border border-border rounded-full px-3 py-1.5 text-xs focus:outline-none focus:border-cyan">
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} message{filtered.length === 1 ? "" : "s"}</span>
      </div>

      {isLoading ? <div className="text-muted-foreground">Loading…</div> :
        !filtered.length ? (
          <div className="card-tech p-12 text-center">
            <Mail className="mx-auto mb-3 text-cyan/50" size={32} />
            <div className="text-muted-foreground">No messages yet. Share your portfolio link to start receiving inquiries from recruiters!</div>
          </div>
        ) :
        <div className="space-y-3">
          {filtered.map((m: any) => {
            const mt = m.message_type ?? "General";
            const isExp = expanded[m.id];
            const preview = m.message.length > 100 && !isExp ? m.message.slice(0, 100) + "…" : m.message;
            const replyHref = `mailto:${m.email}?subject=${encodeURIComponent("Re: " + (m.subject ?? "Your message"))}&body=${encodeURIComponent(`Hi ${m.name},\n\n`)}`;
            return (
              <div key={m.id} className={`card-tech p-4 ${!m.is_read ? "border-l-4 border-l-cyan" : ""}`}>
                <div className="flex items-start gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-display ${!m.is_read ? "font-bold" : ""}`}>{m.name}</span>
                      <a href={`mailto:${m.email}`} className="text-xs text-cyan hover:underline">{m.email}</a>
                      {m.company && <span className="text-xs text-muted-foreground">· {m.company}</span>}
                      <span className={`chip text-[10px] ${typeColors[mt] ?? ""}`}>{mt}</span>
                      {!m.is_read && <span className="chip chip-cyan text-[10px]">NEW</span>}
                    </div>
                    {m.subject && <div className="text-xs text-muted-foreground mt-1">Subject: {m.subject}</div>}
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">{timeAgo(m.created_at)}</span>
                </div>
                <button onClick={() => setExpanded({ ...expanded, [m.id]: !isExp })} className="text-left w-full">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{preview}</p>
                </button>
                <div className="flex gap-2 mt-3">
                  {!m.is_read && (
                    <button onClick={() => markRead(m.id)} className="inline-flex items-center gap-1 text-xs text-cyan hover:underline">
                      <Check size={12} /> Mark as read
                    </button>
                  )}
                  <a href={replyHref} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-cyan">
                    <Reply size={12} /> Reply
                  </a>
                  <button onClick={() => del(m.id)} className={btnDanger}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      }
    </AdminLayout>
  );
}