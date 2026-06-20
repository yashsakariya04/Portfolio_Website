import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash2, X, Save, Images } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Field, TextInput, Select, FileDrop, NumberInput, formCardCls, btnPrimary, btnSecondary, btnDanger } from "@/components/admin/Fields";

export const Route = createFileRoute("/admin/gallery")({ component: GalleryAdmin });

const CATEGORIES = ["Project Screenshot", "Event", "Certificate", "Other"];
const empty = { image_url: "", title: "", description: "", category: "Project Screenshot", order_index: 0 };

function GalleryAdmin() {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["adminGallery"],
    queryFn: async () => (await supabase.from("gallery").select("*").order("order_index")).data ?? [],
  });
  const [editing, setEditing] = useState<any | null>(null);

  const save = async () => {
    if (!editing?.image_url) return toast.error("Image is required");
    const { id, ...payload } = editing;
    const res = id ? await supabase.from("gallery").update(payload).eq("id", id) : await supabase.from("gallery").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved"); setEditing(null); refetch();
  };
  const del = async (id: string) => {
    if (!confirm("Delete this image?")) return;
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); refetch();
  };

  return (
    <AdminLayout title="Gallery">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">{data?.length ?? 0} images</p>
        <button onClick={() => setEditing({ ...empty })} className={btnPrimary}><Plus size={14} /> Add image</button>
      </div>

      {editing && (
        <div className={`${formCardCls} mb-6`}>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">{editing.id ? "Edit image" : "New image"}</h2>
            <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-cyan"><X size={16} /></button>
          </div>
          <Field label="Upload (or paste URL below)">
            <FileDrop bucket="gallery-photos" value={editing.image_url || null} onChange={(u) => setEditing({ ...editing, image_url: u })} />
          </Field>
          <Field label="Image URL"><TextInput value={editing.image_url ?? ""} onChange={(v) => setEditing({ ...editing, image_url: v })} /></Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Caption / Title"><TextInput value={editing.title ?? ""} onChange={(v) => setEditing({ ...editing, title: v })} /></Field>
            <Field label="Category"><Select value={editing.category ?? "Other"} onChange={(v) => setEditing({ ...editing, category: v })} options={CATEGORIES} /></Field>
            <Field label="Order"><NumberInput value={editing.order_index ?? 0} onChange={(v) => setEditing({ ...editing, order_index: v })} /></Field>
          </div>
          <div className="flex gap-3">
            <button onClick={save} className={btnPrimary}><Save size={14} /> Save</button>
            <button onClick={() => setEditing(null)} className={btnSecondary}>Cancel</button>
          </div>
        </div>
      )}

      {isLoading ? <div className="text-muted-foreground">Loading…</div> :
        !data?.length ? (
          <div className="card-tech p-12 text-center text-muted-foreground">
            <Images className="mx-auto mb-3 text-cyan/50" size={32} />
            No gallery images yet. Add your first image above.
          </div>
        ) :
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((g) => (
            <div key={g.id} className="card-tech overflow-hidden group">
              <div className="aspect-video bg-muted overflow-hidden">
                <img src={g.image_url} alt={g.title ?? ""} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-display text-sm truncate">{g.title || "Untitled"}</div>
                  <div className="text-[10px] font-mono text-cyan uppercase">{g.category}</div>
                </div>
                <button onClick={() => setEditing(g)} className="text-muted-foreground hover:text-cyan text-xs">Edit</button>
                <button onClick={() => del(g.id)} className={btnDanger}><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      }
    </AdminLayout>
  );
}