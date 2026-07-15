import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowDown, Download, Sparkles } from "lucide-react";

type Profile = {
  name: string;
  title: string;
  taglines: string[];
  github_url?: string | null;
  linkedin_url?: string | null;
  email?: string | null;
  resume_url?: string | null;
  current_position?: string | null;
  current_company?: string | null;
};

function Typer({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = words[i % words.length];
    const speed = del ? 40 : 80;
    const t = setTimeout(() => {
      if (!del && text === cur) {
        setTimeout(() => setDel(true), 1400);
      } else if (del && text === "") {
        setDel(false);
        setI((p) => p + 1);
      } else {
        setText(del ? cur.slice(0, text.length - 1) : cur.slice(0, text.length + 1));
      }
    }, speed);
    return () => clearTimeout(t);
  }, [text, del, i, words]);
  return (
    <span className="text-cyan font-mono">
      {text}
      <span className="inline-block w-[2px] h-5 bg-cyan ml-1 animate-pulse align-middle" />
    </span>
  );
}

export function Hero({ profile, counts }: { profile: Profile | null; counts?: { projects: number; skills: number; achievements: number } }) {
  const taglines = profile?.taglines?.length
    ? profile.taglines
    : ["AI/ML Engineer", "Backend Architect"];
  const name = profile?.name ?? "Yash Sakariya";
  const currentRole = profile?.current_position ?? "AI Automation Executive & Solution Architect";
  const currentCompany = profile?.current_company ?? "Pucho.ai";
  const headline = profile?.title ?? "AI Automation Engineer & Solution Architect";

  return (
    <section id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, oklch(0.83 0.16 215 / 0.18) 0%, transparent 70%)",
        }}
      />
      {/* floating particles */}
      {Array.from({ length: 14 }).map((_, idx) => (
        <span
          key={idx}
          className="absolute rounded-full bg-cyan/50 animate-floaty"
          style={{
            width: 4 + (idx % 3) * 2,
            height: 4 + (idx % 3) * 2,
            top: `${(idx * 37) % 90 + 5}%`,
            left: `${(idx * 53) % 95 + 2}%`,
            animationDelay: `${(idx % 5) * 0.7}s`,
            opacity: 0.4,
          }}
        />
      ))}

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.a
          href="#experience"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 chip chip-cyan mb-6 hover:border-cyan transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
          <Sparkles size={12} /> Currently: {currentRole} @ {currentCompany}
        </motion.a>

        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] mb-4">
          {name.split(" ").map((word, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.12, ease: [0.22, 1, 0.36, 1], duration: 0.7 }}
              className="inline-block mr-3"
            >
              {idx === 1 ? <span className="text-gradient">{word}</span> : word}
            </motion.span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="text-lg sm:text-xl font-display text-foreground/90 mb-4"
        >
          {headline}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-xl sm:text-2xl mb-4 h-8"
        >
          <span className="text-muted-foreground">[ </span>
          <Typer words={taglines} />
          <span className="text-muted-foreground"> ]</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          I design and ship AI agents and automation workflows that replace manual business processes — from architecture to deployment.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.15 }}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-accent text-primary-foreground font-medium hover:scale-105 transition-transform glow-cyan"
          >
            View My Work <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
          </a>
          {profile?.resume_url ? (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-cyan text-cyan hover:bg-cyan/10 transition-colors"
            >
              <Download size={16} /> Download Resume
            </a>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="flex justify-center gap-5 mb-14"
        >
          {profile?.github_url && (
            <a href={profile.github_url} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-cyan hover:scale-110 transition-all">
              <Github size={20} />
            </a>
          )}
          {profile?.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-cyan hover:scale-110 transition-all">
              <Linkedin size={20} />
            </a>
          )}
          {profile?.email && (
            <a href={`mailto:${profile.email}`} aria-label="Email" className="text-muted-foreground hover:text-cyan hover:scale-110 transition-all">
              <Mail size={20} />
            </a>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { v: `${counts?.projects ?? 0}+`, l: "Projects Built" },
            { v: `${counts?.skills ?? 0}+`, l: "Skills" },
            { v: `${counts?.achievements ?? 0}+`, l: "Achievements" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-3xl sm:text-4xl text-cyan text-glow">{s.v}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}