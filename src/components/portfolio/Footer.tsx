import { Github, Linkedin, Mail } from "lucide-react";

export function Footer({ profile }: { profile: { name?: string; github_url?: string | null; linkedin_url?: string | null; email?: string | null } | null }) {
  return (
    <footer className="border-t border-border bg-card/30 py-10 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 items-center text-sm">
        <div>
          <div className="font-display text-lg font-bold text-cyan text-glow">{profile?.name ?? "Yash Sakariya"}</div>
          <div className="text-muted-foreground text-xs">Building production-grade AI systems.</div>
        </div>
        <div className="flex md:justify-center gap-5 text-muted-foreground text-xs">
          <a href="#about" className="hover:text-cyan">About</a>
          <a href="#projects" className="hover:text-cyan">Projects</a>
          <a href="#contact" className="hover:text-cyan">Contact</a>
        </div>
        <div className="flex md:justify-end gap-3">
          {profile?.github_url && <a href={profile.github_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-cyan"><Github size={16} /></a>}
          {profile?.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-cyan"><Linkedin size={16} /></a>}
          {profile?.email && <a href={`mailto:${profile.email}`} className="text-muted-foreground hover:text-cyan"><Mail size={16} /></a>}
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-6 text-center text-[11px] font-mono text-muted-foreground/60">
        Built with React + Lovable Cloud · Designed & Developed by Yash Sakariya · 2026
      </div>
    </footer>
  );
}