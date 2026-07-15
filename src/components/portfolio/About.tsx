import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import { Download, GraduationCap, MapPin, Briefcase } from "lucide-react";

type Profile = {
  summary: string;
  profile_photo_url?: string | null;
  resume_url?: string | null;
  current_position?: string | null;
  current_company?: string | null;
};

const interests = ["Gym", "Calisthenics", "Garba", "Music", "Open Source"];

export function About({ profile }: { profile: Profile | null }) {
  const currentRole = profile?.current_position ?? "AI Automation Executive & Solution Architect";
  const currentCompany = profile?.current_company ?? "Pucho.ai";
  return (
    <section id="about" className="py-28 px-6 max-w-7xl mx-auto">
      <SectionHeading tag="< About Me />" title="The Engineer Behind the Code" />
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto">
            <div className="absolute -inset-2 rounded-3xl gradient-accent opacity-40 blur-2xl" />
            <div className="relative w-full h-full rounded-3xl overflow-hidden border border-cyan glow-cyan-lg bg-card">
              {profile?.profile_photo_url ? (
                <img src={profile.profile_photo_url} alt="Yash Sakariya" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-display text-7xl text-cyan/30">YS</div>
              )}
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 chip chip-cyan whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
              Currently at {currentCompany}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative rounded-xl border border-cyan/50 bg-cyan/[0.04] p-4 mb-6 glow-cyan">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="chip chip-cyan text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" /> Current Role
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">Jul 2026 – Present</span>
            </div>
            <div className="font-display text-lg font-semibold">{currentRole}</div>
            <div className="text-cyan font-mono text-sm mb-2">@ {currentCompany}</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              I design agentic workflows and multi-agent automations, integrate LLMs into real business processes, and own end-to-end solution architecture for client and internal automation projects.
            </p>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">
            {profile?.summary ?? ""}
          </p>

          <div className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-wider mb-2">// background</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <Fact icon={<GraduationCap size={14} />} label="Ganpat University · B.Tech AI · CGPA 8.39" />
            <Fact icon={<MapPin size={14} />} label="Ahmedabad, Gujarat" />
            <Fact icon={<Briefcase size={14} />} label="Previously: AI/ML Intern @ Infopulse Technology" />
          </div>

          <div className="flex flex-wrap gap-1.5 mb-6 opacity-60">
            {interests.map((i) => (
              <span key={i} className="chip text-[10px] border-border/60">{i}</span>
            ))}
          </div>

          {profile?.resume_url && (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-cyan text-cyan hover:bg-cyan/10 transition-colors text-sm"
            >
              <Download size={14} /> Download Resume
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Fact({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-start gap-2 text-xs text-muted-foreground/80">
      <span className="text-cyan/70 mt-0.5">{icon}</span>
      <span>{label}</span>
    </div>
  );
}