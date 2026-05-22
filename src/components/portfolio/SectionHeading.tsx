import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function SectionHeading({ tag, title, subtitle }: { tag: string; title: ReactNode; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <div className="font-mono text-xs text-cyan mb-3">{tag}</div>
      <h2 className="font-display text-3xl sm:text-5xl font-bold mb-3">{title}</h2>
      {subtitle && <p className="text-muted-foreground max-w-2xl">{subtitle}</p>}
    </motion.div>
  );
}