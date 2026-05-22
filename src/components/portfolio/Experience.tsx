import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";

type Exp = {
  id: string;
  company: string;
  role: string;
  type: string;
  location?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_current: boolean;
  description?: string | null;
  responsibilities?: string[] | null;
  tech_used?: string[] | null;
};

export function Experience({ items }: { items: Exp[] }) {
  return (
    <section id="experience" className="py-28 px-6 max-w-5xl mx-auto">
      <SectionHeading tag="< Journey />" title="Journey So Far" subtitle="From the classroom to production AI systems." />
      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan/60 via-cyan/20 to-transparent" />
        <div className="space-y-12">
          {items.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className={`relative md:grid md:grid-cols-2 md:gap-12 ${i % 2 === 0 ? "" : "md:[direction:rtl]"}`}
            >
              <div className={`pl-12 md:pl-0 ${i % 2 === 0 ? "md:text-right md:pr-12" : "md:[direction:ltr] md:pl-12"}`}>
                <div className="absolute left-2 md:left-1/2 top-2 -translate-x-1/2 w-5 h-5 rounded-full bg-background border-2 border-cyan glow-cyan" />
                <div className="card-tech p-6 md:[direction:ltr] text-left">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="chip chip-cyan">{e.type}</span>
                    {e.is_current && (
                      <span className="chip text-green-400 border-green-400/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" /> Current
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-xl font-semibold">{e.role}</h3>
                  <div className="text-cyan font-mono text-sm">{e.company}</div>
                  <div className="text-xs text-muted-foreground mt-1 mb-3">
                    {e.start_date} – {e.end_date} · {e.location}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{e.description}</p>
                  {e.responsibilities && e.responsibilities.length > 0 && (
                    <ul className="space-y-1 mb-3">
                      {e.responsibilities.map((r) => (
                        <li key={r} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-cyan mt-0.5">›</span> {r}
                        </li>
                      ))}
                    </ul>
                  )}
                  {e.tech_used && e.tech_used.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {e.tech_used.map((t) => <span key={t} className="chip text-[10px]">{t}</span>)}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}