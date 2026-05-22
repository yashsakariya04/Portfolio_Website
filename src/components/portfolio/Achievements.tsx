import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";

type Ach = { id: string; title: string; description?: string | null; icon: string | null; date?: string | null; category?: string | null };

export function Achievements({ items }: { items: Ach[] }) {
  return (
    <section id="achievements" className="py-28 px-6 max-w-7xl mx-auto">
      <SectionHeading tag="< Achievements />" title="Recognition & Impact" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.06 }}
            className="card-tech p-6 group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{a.icon}</div>
            <div className="font-display text-lg font-semibold mb-1">{a.title}</div>
            <p className="text-sm text-muted-foreground mb-3">{a.description}</p>
            <div className="flex justify-between text-[10px] font-mono text-cyan uppercase tracking-wider">
              <span>{a.category}</span>
              <span>{a.date}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}