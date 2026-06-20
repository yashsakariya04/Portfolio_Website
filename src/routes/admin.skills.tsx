import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Edit, Trash2, X, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Field, TextInput, Select, Slider, NumberInput, formCardCls, btnPrimary, btnSecondary, btnDanger } from "@/components/admin/Fields";

export const Route = createFileRoute("/admin/skills")({ component: SkillsAdmin });

const CATEGORIES = ["Languages", "AI/ML", "Libraries & Frameworks", "Backend & Deployment", "Databases & Tools"];
const empty = { name: "", category: "Languages", proficiency: 80, icon_name: "⚙️", order_index: 0 };

function SkillsAdmin() {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["adminSkills"],
    queryFn: async () => (await supabase.from("skills").select("*").order("category").order("order_index")).data ?? [],
  });
  const [editing, setEditing] = useState<any | null>(null);

  const save = async () => {
    if (!editing?.name?.trim()) return toast.error("Name required");
    const { id, ...payload } = editing;
    const res = id ? await supabase.from("skills").update(payload).eq("id", id) : await supabase.from("skills").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved"); setEditing(null); refetch();
  };
  const del = async (id: string, name: string) => {
    if (!confirm(`Delete skill "${name}"?`)) return;
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); refetch();
  };

  const grouped = (data ?? []).reduce<Record<string, any[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s); return acc;
  }, {});

  return (
    <AdminLayout title="Skills">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">{data?.length ?? 0} skills</p>
        <button onClick={() => setEditing({ ...empty })} className={btnPrimary}><Plus size={14} /> Add skill</button>
      </div>

      {editing && (
        <div className={`${formCardCls} mb-6`}>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">{editing.id ? "Edit skill" : "New skill"}</h2>
            <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-cyan"><X size={16} /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name"><TextInput value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} /></Field>
            <Field label="Category"><Select value={editing.category} onChange={(v) => setEditing({ ...editing, category: v })} options={CATEGORIES} /></Field>
            <Field label="Icon / Emoji"><TextInput value={editing.icon_name ?? ""} onChange={(v) => setEditing({ ...editing, icon_name: v })} /></Field>
            <Field label="Order"><NumberInput value={editing.order_index ?? 0} onChange={(v) => setEditing({ ...editing, order_index: v })} /></Field>
          </div>
          <Field label="Proficiency"><Slider value={editing.proficiency ?? 0} onChange={(v) => setEditing({ ...editing, proficiency: v })} /></Field>
          <div className="flex gap-3">
            <button onClick={save} className={btnPrimary}><Save size={14} /> Save</button>
            <button onClick={() => setEditing(null)} className={btnSecondary}>Cancel</button>
          </div>
        </div>
      )}

      {isLoading ? <div className="text-muted-foreground">Loading…</div> :
        !data?.length ? <div className="card-tech p-12 text-center text-muted-foreground">No skills yet.</div> :
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <div className="font-mono text-xs text-cyan uppercase mb-2">// {cat}</div>
              <div className="grid sm:grid-cols-2 gap-2">
                {items.map((s) => (
                  <div key={s.id} className="card-tech p-3 flex items-center gap-3">
                    <span className="text-xl">{s.icon_name ?? "⚙️"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-semibold truncate">{s.name}</div>
                      <div className="h-1 rounded-full bg-muted mt-1 overflow-hidden">
                        <div className="h-full gradient-accent" style={{ width: `${s.proficiency ?? 0}%` }} />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-cyan">{s.proficiency ?? 0}%</span>
                    <button onClick={() => setEditing(s)} className="text-muted-foreground hover:text-cyan p-1.5"><Edit size={12} /></button>
                    <button onClick={() => del(s.id, s.name)} className={btnDanger}><Trash2 size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      }
    </AdminLayout>
  );
}