import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Field, TextInput, TextArea, NumberInput, Select, Toggle, TagInput, ListInput, FileDrop, formCardCls, btnPrimary, btnSecondary } from "@/components/admin/Fields";

export const Route = createFileRoute("/admin/projects/$id")({ component: ProjectEditor });

const CATEGORIES = ["Agentic AI", "Backend", "Computer Vision", "Multi-Agent", "Healthcare AI", "Frontend"];
const STATUSES = ["completed", "in-progress"];
const empty = { title: "", category: "Agentic AI", description: "", long_description: "", tech_stack: [] as string[], github_url: "", live_url: "", thumbnail_url: null as string | null, screenshots: [] as string[], architecture_highlights: [] as string[], is_featured: false, is_flagship: false, status: "completed", order_index: 0 };

function ProjectEditor() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const isNew = id === "new";
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const { data } = useQuery({
    queryKey: ["project", id], enabled: !isNew,
    queryFn: async () => (await supabase.from("projects").select("*").eq("id", id).maybeSingle()).data,
  });
  useEffect(() => { if (isNew) setForm(empty); else if (data) setForm({ ...empty, ...data }); }, [isNew, data]);
  if (!form) return <AdminLayout title="Project"><div className="text-muted-foreground">Loading…</div></AdminLayout>;
  const set = (k: string, v: any) => setForm({ ...form, [k]: v });
  const save = async () => {
    if (!form.title.trim()) return toast.error("Title required");
    setSaving(true);
    const { id: _i, created_at, ...payload } = form;
    const res = isNew ? await supabase.from("projects").insert(payload) : await supabase.from("projects").update(payload).eq("id", id);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved"); navigate({ to: "/admin/projects" });
  };
  return (
    <AdminLayout title={isNew ? "New project" : "Edit project"}>
      <button onClick={() => navigate({ to: "/admin/projects" })} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-cyan mb-4"><ArrowLeft size={12} /> Back</button>
      <div className="space-y-6 max-w-3xl">
        <div className={formCardCls}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Title"><TextInput value={form.title} onChange={(v) => set("title", v)} /></Field>
            <Field label="Category"><Select value={form.category} onChange={(v) => set("category", v)} options={CATEGORIES} /></Field>
          </div>
          <Field label="Short description"><TextArea rows={2} value={form.description ?? ""} onChange={(v) => set("description", v)} /></Field>
          <Field label="Long description"><TextArea rows={5} value={form.long_description ?? ""} onChange={(v) => set("long_description", v)} /></Field>
          <Field label="Tech stack"><TagInput tags={form.tech_stack ?? []} onChange={(t) => set("tech_stack", t)} /></Field>
        </div>
        <div className={formCardCls}>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="GitHub URL"><TextInput value={form.github_url ?? ""} onChange={(v) => set("github_url", v)} /></Field>
            <Field label="Live URL"><TextInput value={form.live_url ?? ""} onChange={(v) => set("live_url", v)} /></Field>
          </div>
          <Field label="Thumbnail"><FileDrop bucket="project-thumbnails" value={form.thumbnail_url} onChange={(u) => set("thumbnail_url", u)} /></Field>
        </div>
        <div className={formCardCls}>
          <Field label="Architecture highlights"><ListInput items={form.architecture_highlights ?? []} onChange={(v) => set("architecture_highlights", v)} /></Field>
        </div>
        <div className={formCardCls}>
          <div className="flex flex-wrap gap-3">
            <Toggle value={!!form.is_featured} onChange={(v) => set("is_featured", v)} label="Featured" />
            <Toggle value={!!form.is_flagship} onChange={(v) => set("is_flagship", v)} label="Flagship" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Status"><Select value={form.status ?? "completed"} onChange={(v) => set("status", v)} options={STATUSES} /></Field>
            <Field label="Order"><NumberInput value={form.order_index ?? 0} onChange={(v) => set("order_index", v)} /></Field>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={save} disabled={saving} className={btnPrimary}><Save size={14} /> {saving ? "Saving…" : "Save"}</button>
          <button onClick={() => navigate({ to: "/admin/projects" })} className={btnSecondary}>Cancel</button>
        </div>
      </div>
    </AdminLayout>
  );
}