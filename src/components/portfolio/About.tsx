import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import { Download, GraduationCap, MapPin, Briefcase, Dumbbell } from "lucide-react";

type Profile = {
  summary: string;
  profile_photo_url?: string | null;
  resume_url?: string | null;
};

const interests = ["Gym", "Calisthenics", "Garba", "Music", "Open Source"];

export function About({ profile }: { profile: Profile | null }) {
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
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 chip chip-cyan">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
              Currently at Infopulse Technology
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-muted-foreground leading-relaxed mb-8">
            {profile?.summary ?? ""}
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Fact icon={<GraduationCap size={16} />} label="Ganpat University · B.Tech AI · CGPA 8.39" />
            <Fact icon={<MapPin size={16} />} label="Ahmedabad, Gujarat" />
            <Fact icon={<Briefcase size={16} />} label="Infopulse Technology Intern" />
            <Fact icon={<Dumbbell size={16} />} label="Gym · Music · Garba" />
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {interests.map((i) => (
              <span key={i} className="chip hover:border-cyan hover:text-cyan transition-colors cursor-default">
                {i}
              </span>
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
    <div className="flex items-start gap-2 text-sm">
      <span className="text-cyan mt-0.5">{icon}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}