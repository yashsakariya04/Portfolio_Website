import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";

type Skill = {
  id: string;
  name: string;
  category: string;
  proficiency: number | null;
  icon_name?: string | null;
  tier?: string | null;
};

const TIERS: { key: string; title: string; blurb: string }[] = [
  { key: "core", title: "Core", blurb: "What I reach for first — every day, in production." },
  { key: "important", title: "Important", blurb: "Backbone of the systems I ship." },
  { key: "supporting", title: "Supporting", blurb: "Solid working knowledge when a project calls for it." },
];

export function Skills({ skills }: { skills: Skill[] }) {
  return (
    <section id="skills" className="py-28 px-6 max-w-7xl mx-auto">
      <SectionHeading
        tag="< Skills />"
        title="Technical Arsenal"
        subtitle="Grouped by how central each is to the systems I build — not by category alphabet soup."
      />

      <div className="space-y-10">
        {TIERS.map((tier, ti) => {
          const items = skills.filter((s) => (s.tier ?? "supporting") === tier.key);
          if (items.length === 0) return null;
          const isCore = tier.key === "core";
          const isImportant = tier.key === "important";
          return (
            <div key={tier.key}>
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-cyan">// tier {ti + 1}</span>
                  <h3 className={`font-display font-semibold ${isCore ? "text-2xl" : "text-lg"}`}>
                    {tier.title}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground hidden sm:block">{tier.blurb}</p>
              </div>

              <motion.div
                layout
                className={`grid gap-3 ${
                  isCore
                    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
                    : isImportant
                    ? "grid-cols-2 sm:grid-cols-4 lg:grid-cols-6"
                    : "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6"
                }`}
              >
                {items.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ delay: (i % 10) * 0.03 }}
                    className={
                      isCore
                        ? "card-tech p-4 border-cyan/40 hover:border-cyan hover:-translate-y-0.5 transition-all"
                        : isImportant
                        ? "card-tech p-3 hover:border-cyan/60 transition-colors"
                        : "flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 bg-card/30 text-muted-foreground text-xs"
                    }
                  >
                    <div className={`flex items-center gap-2 ${isCore ? "mb-2" : isImportant ? "mb-1.5" : ""}`}>
                      <span className={isCore ? "text-2xl" : isImportant ? "text-lg" : "text-sm"}>
                        {s.icon_name ?? "⚙️"}
                      </span>
                      <span className={`font-display ${isCore ? "font-semibold text-base" : isImportant ? "font-medium text-sm" : "text-xs"}`}>
                        {s.name}
                      </span>
                    </div>
                    {isCore && (
                      <>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${s.proficiency ?? 0}%` }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full gradient-accent"
                          />
                        </div>
                        <div className="text-right text-[10px] font-mono text-cyan mt-1">{s.proficiency ?? 0}%</div>
                      </>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}