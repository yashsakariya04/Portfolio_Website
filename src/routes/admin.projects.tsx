import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Trophy, Star } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { btnPrimary, btnDanger } from "@/components/admin/Fields";

export const Route = createFileRoute("/admin/projects")({ component: ProjectsAdmin });

function ProjectsAdmin() {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["adminProjects"],
    queryFn: async () => {
      const { data } = await supabase.from("projects").select("*").order("order_index");
      return data ?? [];
    },
  });
  const del = async (id: string, title: string) => {
    if (!confirm(`Delete project "${title}"?`)) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); refetch();
  };
  return (
    <AdminLayout title="Projects">
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">{data?.length ?? 0} projects</p>
        <Link to="/admin/projects/$id" params={{ id: "new" }} className={btnPrimary}><Plus size={14} /> Add project</Link>
      </div>
      {isLoading ? <div className="text-muted-foreground">Loading…</div> :
        !data?.length ? <div className="card-tech p-12 text-center text-muted-foreground">No projects yet.</div> :
        <div className="space-y-3">
          {data.map((p) => (
            <div key={p.id} className="card-tech p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0 flex items-center justify-center text-cyan/40 font-display">
                {p.thumbnail_url ? <img src={p.thumbnail_url} alt="" className="w-full h-full object-cover" /> : p.title.slice(0,2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-display font-semibold truncate">{p.title}</span>
                  {p.is_flagship && <span className="chip chip-cyan inline-flex items-center gap-1"><Trophy size={10} /> Flagship</span>}
                  {p.is_featured && <span className="chip inline-flex items-center gap-1"><Star size={10} /> Featured</span>}
                </div>
                <div className="text-xs text-muted-foreground">{p.category} · {p.status} · order {p.order_index}</div>
              </div>
              <Link to="/admin/projects/$id" params={{ id: p.id }} className="text-muted-foreground hover:text-cyan p-2"><Edit size={14} /></Link>
              <button onClick={() => del(p.id, p.title)} className={btnDanger}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      }
    </AdminLayout>
  );
}