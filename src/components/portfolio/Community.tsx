import { motion } from "framer-motion";
import { Users, HeartHandshake, GitBranch } from "lucide-react";

const items = [
  { icon: <Users size={16} />, title: "ISA Student Chapter", role: "Co-Lead — Documentation", years: "2024 – 2025" },
  { icon: <HeartHandshake size={16} />, title: "NSS", role: "Coordinator", years: "2023 – 2025" },
  { icon: <GitBranch size={16} />, title: "Open Source", role: "Contributor — Agentic AI & backend tooling", years: "Ongoing" },
];

export function Community() {
  return (
    <section id="community" className="py-14 px-6 max-w-7xl mx-auto">
      <div className="rounded-2xl border border-border bg-card/30 p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="font-mono text-xs text-cyan">// community & leadership</span>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {items.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-3"
            >
              <span className="text-cyan mt-0.5">{c.icon}</span>
              <div>
                <div className="font-display text-sm font-semibold">{c.title}</div>
                <div className="text-xs text-muted-foreground">{c.role}</div>
                <div className="text-[10px] font-mono text-muted-foreground/70 mt-0.5">{c.years}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}