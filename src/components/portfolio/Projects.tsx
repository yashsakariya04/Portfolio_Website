import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import { Github, ExternalLink, X, Trophy } from "lucide-react";

type Project = {
  id: string;
  title: string;
  category: string;
  description: string | null;
  long_description: string | null;
  tech_stack: string[] | null;
  github_url: string | null;
  live_url: string | null;
  thumbnail_url: string | null;
  screenshots: string[] | null;
  architecture_highlights: string[] | null;
  is_flagship: boolean | null;
  status: string | null;
};

const catColors: Record<string, string> = {
  "Agentic AI": "text-cyan border-cyan/40",
  "Backend": "text-blue-400 border-blue-400/40",
  "Computer Vision": "text-purple-400 border-purple-400/40",
  "Multi-Agent": "text-pink-400 border-pink-400/40",
  "Healthcare AI": "text-emerald-400 border-emerald-400/40",
  "Frontend": "text-amber-400 border-amber-400/40",
};

export function Projects({ projects }: { projects: Project[] }) {
  const flagship = projects.find((p) => p.is_flagship);
  const rest = projects.filter((p) => !p.is_flagship);
  const categories = useMemo(() => ["All", ...Array.from(new Set(rest.map((p) => p.category)))], [rest]);
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState<Project | null>(null);

  const filtered = filter === "All" ? rest : rest.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-28 px-6 max-w-7xl mx-auto">
      <SectionHeading tag="< Projects />" title="What I've Built" subtitle="Real production systems — not tutorials." />

      {flagship && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="relative mb-14 rounded-2xl border border-cyan/40 overflow-hidden glow-cyan-lg group"
        >
          <div className="absolute inset-0 gradient-accent opacity-[0.06]" />
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-10">
            <div>
              <div className="inline-flex items-center gap-2 chip chip-cyan mb-4">
                <Trophy size={12} /> Flagship Project
              </div>
              <h3 className="font-display text-3xl md:text-4xl font-bold mb-3">{flagship.title}</h3>
              <div className="text-xs font-mono text-cyan mb-4 uppercase tracking-wider">
                {flagship.category} · Production
              </div>
              <p className="text-muted-foreground mb-5">{flagship.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {flagship.tech_stack?.map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>
              <ul className="space-y-2 mb-6">
                {flagship.architecture_highlights?.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 mt-2 rounded-full bg-cyan flex-shrink-0" /> {h}
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                {flagship.github_url && (
                  <a href={flagship.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:border-cyan hover:text-cyan transition-colors text-sm">
                    <Github size={14} /> GitHub
                  </a>
                )}
                {flagship.live_url && (
                  <a href={flagship.live_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-accent text-primary-foreground text-sm hover:scale-105 transition-transform">
                    <ExternalLink size={14} /> Live Demo
                  </a>
                )}
              </div>
            </div>
            <div className="relative rounded-xl border border-border bg-background/60 p-4 font-mono text-xs overflow-hidden min-h-[280px]">
              <div className="flex gap-1.5 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <pre className="text-cyan/80 whitespace-pre-wrap leading-relaxed">
{`$ ai-action-assistant init
→ planning task...
→ tool: search_web()
→ tool: write_file('report.md')
→ verifying outcomes...
✓ task completed in 3.2s`}
              </pre>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-1.5 rounded-full text-sm transition-all ${
              filter === c ? "bg-cyan text-primary-foreground glow-cyan" : "border border-border text-muted-foreground hover:border-cyan hover:text-cyan"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p, i) => (
          <motion.button
            key={p.id}
            layout
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: (i % 6) * 0.06 }}
            onClick={() => setOpen(p)}
            className="card-tech p-6 text-left group hover:-translate-y-1"
          >
            <div className="aspect-video rounded-lg mb-4 overflow-hidden bg-gradient-to-br from-cyan/10 to-blue-500/10 flex items-center justify-center">
              {p.thumbnail_url ? (
                <img src={p.thumbnail_url} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <div className="font-display text-4xl text-cyan/30">{p.title.slice(0, 2).toUpperCase()}</div>
              )}
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`chip ${catColors[p.category] ?? "text-cyan border-cyan/40"}`}>{p.category}</span>
              <span className={`chip ${p.status === "completed" ? "text-green-400 border-green-400/30" : "text-amber-400 border-amber-400/30"}`}>
                {p.status === "completed" ? "Completed" : "In Progress"}
              </span>
            </div>
            <h3 className="font-display text-xl font-semibold mb-2 group-hover:text-cyan transition-colors">{p.title}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{p.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {p.tech_stack?.slice(0, 4).map((t) => (
                <span key={t} className="chip text-[10px]">{t}</span>
              ))}
              {(p.tech_stack?.length ?? 0) > 4 && <span className="chip text-[10px]">+{(p.tech_stack?.length ?? 0) - 4}</span>}
            </div>
            <div className="flex gap-3 text-muted-foreground">
              {p.github_url && <Github size={16} />}
              {p.live_url && <ExternalLink size={16} />}
            </div>
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-start justify-center p-4 overflow-y-auto"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="relative my-12 max-w-3xl w-full card-tech p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setOpen(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-cyan"><X /></button>
              <div className="flex items-center gap-2 mb-3">
                <span className={`chip ${catColors[open.category] ?? "text-cyan border-cyan/40"}`}>{open.category}</span>
                <span className="chip">{open.status}</span>
              </div>
              <h3 className="font-display text-3xl font-bold mb-4">{open.title}</h3>
              <p className="text-muted-foreground mb-6">{open.long_description ?? open.description}</p>
              {open.architecture_highlights && open.architecture_highlights.length > 0 && (
                <>
                  <div className="font-mono text-xs text-cyan mb-2">// architecture</div>
                  <ul className="space-y-2 mb-6">
                    {open.architecture_highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 mt-2 rounded-full bg-cyan flex-shrink-0" /> {h}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {open.tech_stack?.map((t) => <span key={t} className="chip">{t}</span>)}
              </div>
              <div className="flex gap-3">
                {open.github_url && (
                  <a href={open.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:border-cyan hover:text-cyan text-sm">
                    <Github size={14} /> GitHub
                  </a>
                )}
                {open.live_url && (
                  <a href={open.live_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-accent text-primary-foreground text-sm">
                    <ExternalLink size={14} /> Live Demo
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}