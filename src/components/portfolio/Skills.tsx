import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";

type Skill = { id: string; name: string; category: string; proficiency: number; icon_name?: string | null };

export function Skills({ skills }: { skills: Skill[] }) {
  const categories = useMemo(() => {
    const set = new Set(skills.map((s) => s.category));
    return ["All", ...Array.from(set)];
  }, [skills]);
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? skills : skills.filter((s) => s.category === active);

  return (
    <section id="skills" className="py-28 px-6 max-w-7xl mx-auto">
      <SectionHeading tag="< Skills />" title="Technical Arsenal" subtitle="The tools I reach for to build production AI systems." />
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`px-4 py-1.5 rounded-full text-sm transition-all ${
              active === c
                ? "bg-cyan text-primary-foreground glow-cyan"
                : "border border-border text-muted-foreground hover:border-cyan hover:text-cyan"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((s, i) => (
          <motion.div
            key={s.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: (i % 12) * 0.04 }}
            className="card-tech p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{s.icon_name ?? "⚙️"}</span>
              <span className="font-display font-semibold">{s.name}</span>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground mb-2 uppercase tracking-wider">{s.category}</div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${s.proficiency}%` }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full gradient-accent"
              />
            </div>
            <div className="text-right text-[10px] font-mono text-cyan mt-1">{s.proficiency}%</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}