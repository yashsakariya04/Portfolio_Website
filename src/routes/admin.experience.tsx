import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Edit, Trash2, X, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Field, TextInput, TextArea, Select, Toggle, TagInput, ListInput, NumberInput, formCardCls, btnPrimary, btnSecondary, btnDanger } from "@/components/admin/Fields";

export const Route = createFileRoute("/admin/experience")({ component: ExperienceAdmin });

const TYPES = ["Work Experience", "Internship", "Training", "Education"];
const empty = {
  type: "Work Experience", role: "", company: "", location: "",
  start_date: "", end_date: "", is_current: false,
  description: "", responsibilities: [] as string[], tech_used: [] as string[],
  logo_url: null as string | null, order_index: 0,
};

function ExperienceAdmin() {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["adminExperience"],
    queryFn: async () => (await supabase.from("experience").select("*").order("order_index")).data ?? [],
  });
  const [editing, setEditing] = useState<any | null>(null);

  const save = async () => {
    if (!editing?.role?.trim() || !editing?.company?.trim()) return toast.error("Role and company required");
    const { id, ...payload } = editing;
    if (payload.is_current) payload.end_date = null;
    const res = id ? await supabase.from("experience").update(payload).eq("id", id) : await supabase.from("experience").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved"); setEditing(null); refetch();
  };
  const del = async (id: string, label: string) => {
    if (!confirm(`Delete "${label}"?`)) return;
    const { error } = await supabase.from("experience").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); refetch();
  };

  return (
    <AdminLayout title="Experience">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">{data?.length ?? 0} entries</p>
        <button onClick={() => setEditing({ ...empty })} className={btnPrimary}><Plus size={14} /> Add entry</button>
      </div>

      {editing && (
        <div className={`${formCardCls} mb-6`}>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">{editing.id ? "Edit entry" : "New entry"}</h2>
            <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-cyan"><X size={16} /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Type"><Select value={editing.type} onChange={(v) => setEditing({ ...editing, type: v })} options={TYPES} /></Field>
            <Field label="Order"><NumberInput value={editing.order_index ?? 0} onChange={(v) => setEditing({ ...editing, order_index: v })} /></Field>
            <Field label="Role / Degree"><TextInput value={editing.role} onChange={(v) => setEditing({ ...editing, role: v })} /></Field>
            <Field label="Company / Institution"><TextInput value={editing.company} onChange={(v) => setEditing({ ...editing, company: v })} /></Field>
            <Field label="Location"><TextInput value={editing.location ?? ""} onChange={(v) => setEditing({ ...editing, location: v })} /></Field>
            <Field label="Start (e.g. Feb 2026)"><TextInput value={editing.start_date ?? ""} onChange={(v) => setEditing({ ...editing, start_date: v })} /></Field>
            <Field label="End (or leave blank if current)"><TextInput value={editing.end_date ?? ""} onChange={(v) => setEditing({ ...editing, end_date: v })} /></Field>
            <div className="flex items-end">
              <Toggle value={!!editing.is_current} onChange={(v) => setEditing({ ...editing, is_current: v })} label="Current" />
            </div>
          </div>
          <Field label="Description"><TextArea rows={3} value={editing.description ?? ""} onChange={(v) => setEditing({ ...editing, description: v })} /></Field>
          <Field label="Responsibilities"><ListInput items={editing.responsibilities ?? []} onChange={(v) => setEditing({ ...editing, responsibilities: v })} /></Field>
          <Field label="Tech / Skills used"><TagInput tags={editing.tech_used ?? []} onChange={(v) => setEditing({ ...editing, tech_used: v })} /></Field>
          <div className="flex gap-3">
            <button onClick={save} className={btnPrimary}><Save size={14} /> Save</button>
            <button onClick={() => setEditing(null)} className={btnSecondary}>Cancel</button>
          </div>
        </div>
      )}

      {isLoading ? <div className="text-muted-foreground">Loading…</div> :
        !data?.length ? <div className="card-tech p-12 text-center text-muted-foreground">No experience yet.</div> :
        <div className="space-y-3">
          {data.map((e) => (
            <div key={e.id} className="card-tech p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="chip chip-cyan">{e.type}</span>
                  {e.is_current && <span className="chip text-green-400 border-green-400/30">Current</span>}
                </div>
                <div className="font-display font-semibold">{e.role}</div>
                <div className="text-xs text-cyan font-mono">{e.company}</div>
                <div className="text-xs text-muted-foreground">{e.start_date} – {e.is_current ? "Present" : (e.end_date || "")} · {e.location}</div>
              </div>
              <button onClick={() => setEditing(e)} className="text-muted-foreground hover:text-cyan p-2"><Edit size={14} /></button>
              <button onClick={() => del(e.id, e.role)} className={btnDanger}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      }
    </AdminLayout>
  );
}