import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Edit, Trash2, X, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Field, TextInput, TextArea, Select, formCardCls, btnPrimary, btnSecondary, btnDanger } from "@/components/admin/Fields";

export const Route = createFileRoute("/admin/achievements")({ component: AchievementsAdmin });

const CATEGORIES = ["Academic", "Certification", "Leadership", "Project", "Competition", "Other"];
const empty = { title: "", description: "", category: "Academic", date: "", icon: "🏆" };

function AchievementsAdmin() {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["adminAchievements"],
    queryFn: async () => (await supabase.from("achievements").select("*").order("date", { ascending: false })).data ?? [],
  });
  const [editing, setEditing] = useState<any | null>(null);

  const save = async () => {
    if (!editing?.title?.trim()) return toast.error("Title required");
    const { id, ...payload } = editing;
    const res = id ? await supabase.from("achievements").update(payload).eq("id", id) : await supabase.from("achievements").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved"); setEditing(null); refetch();
  };
  const del = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    const { error } = await supabase.from("achievements").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); refetch();
  };

  return (
    <AdminLayout title="Achievements">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">{data?.length ?? 0} achievements</p>
        <button onClick={() => setEditing({ ...empty })} className={btnPrimary}><Plus size={14} /> Add achievement</button>
      </div>

      {editing && (
        <div className={`${formCardCls} mb-6`}>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">{editing.id ? "Edit achievement" : "New achievement"}</h2>
            <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-cyan"><X size={16} /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Title"><TextInput value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} /></Field>
            <Field label="Category"><Select value={editing.category ?? "Other"} onChange={(v) => setEditing({ ...editing, category: v })} options={CATEGORIES} /></Field>
            <Field label="Date / Year"><TextInput value={editing.date ?? ""} onChange={(v) => setEditing({ ...editing, date: v })} /></Field>
            <Field label="Icon / Emoji"><TextInput value={editing.icon ?? ""} onChange={(v) => setEditing({ ...editing, icon: v })} /></Field>
          </div>
          <Field label="Description"><TextArea rows={3} value={editing.description ?? ""} onChange={(v) => setEditing({ ...editing, description: v })} /></Field>
          <div className="flex gap-3">
            <button onClick={save} className={btnPrimary}><Save size={14} /> Save</button>
            <button onClick={() => setEditing(null)} className={btnSecondary}>Cancel</button>
          </div>
        </div>
      )}

      {isLoading ? <div className="text-muted-foreground">Loading…</div> :
        !data?.length ? <div className="card-tech p-12 text-center text-muted-foreground">No achievements yet.</div> :
        <div className="grid sm:grid-cols-2 gap-3">
          {data.map((a) => (
            <div key={a.id} className="card-tech p-4 flex items-start gap-3">
              <div className="text-2xl">{a.icon ?? "🏆"}</div>
              <div className="flex-1 min-w-0">
                <div className="font-display font-semibold">{a.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-2">{a.description}</div>
                <div className="text-[10px] font-mono text-cyan uppercase mt-1">{a.category} · {a.date}</div>
              </div>
              <button onClick={() => setEditing(a)} className="text-muted-foreground hover:text-cyan p-1.5"><Edit size={14} /></button>
              <button onClick={() => del(a.id, a.title)} className={btnDanger}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      }
    </AdminLayout>
  );
}