import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, Copy, Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Contact } from "./Contact";

const SignalField = lazy(() => import("./SignalField"));

export type NotebookProject = {
  id: string;
  slug: string | null;
  title: string;
  category: string;
  project_type: string;
  description: string | null;
  long_description: string | null;
  outcome_line: string | null;
  problem: string | null;
  role: string | null;
  built_points: string[];
  impact_metrics: string[];
  stack: string[];
  architecture_steps: string[];
  architecture_highlights: string[] | null;
  tech_stack: string[] | null;
  github_url: string | null;
  live_url: string | null;
  cover_image: string | null;
  order_index: number | null;
  year: string | null;
};

type Profile = {
  name: string;
  title: string;
  summary: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  resume_url: string | null;
  profile_photo_url: string | null;
  availability_status: string | null;
  current_position: string | null;
  current_company: string | null;
};

type ExperienceItem = {
  id: string;
  company: string;
  role: string;
  type: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean | null;
  description: string | null;
};

type SkillItem = { id: string; name: string; category: string; tier: string | null };

const skillGroups = [
  { title: "Core", values: ["Python", "TypeScript", "FastAPI", "Node.js", "PostgreSQL", "LLMs", "RAG"] },
  { title: "AI", values: ["Agentic & multi-agent systems", "Embeddings & re-ranking", "OCR pipelines", "MCP", "Computer vision", "YOLO", "ByteTrack", "OpenCV"] },
  { title: "Web & Data", values: ["Next.js", "React", "Supabase", "PostgREST", "Redis", "ChromaDB"] },
  { title: "DevOps", values: ["Docker", "AWS EC2 / RDS", "Nginx", "Dokploy", "Vitest", "Playwright"] },
];

const principles = [
  ["01", "The database is the record", "AI workflows do the AI; the database remains the source of truth."],
  ["02", "Answers carry evidence", "Every AI answer cites the evidence it came from."],
  ["03", "Secrets stay server-side", "Secrets and webhook URLs never reach the browser."],
  ["04", "Trust is earned", "Tests and audit logs come before trust."],
];

const proof = [
  ["841", "server tests", "Market Intelligence Platform"],
  ["31 → 12", "tabs migrated to tables", "Google Sheets → PostgreSQL"],
  ["~98%", "lower workflow credit usage", "Sales CRM"],
  ["2,912+", "tenders restored", "after removing a record cap"],
];

export function Notebook({ profile, projects, experience, skills }: {
  profile: Profile | null;
  projects: NotebookProject[];
  experience: ExperienceItem[];
  skills: SkillItem[];
}) {
  const reduceMotion = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [clock, setClock] = useState("");
  const [cursor, setCursor] = useState({ x: -40, y: -40, label: "" });

  useEffect(() => {
    setHydrated(true);
    const saved = window.localStorage.getItem("notebook-theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(saved ? saved === "dark" : systemDark);
    const formatter = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    const updateClock = () => setClock(formatter.format(new Date()));
    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    const onPointer = (event: PointerEvent) => {
      if (window.matchMedia("(hover: none)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      setCursor({ x: event.clientX, y: event.clientY, label: target?.dataset.cursor ?? "" });
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => { window.clearInterval(timer); window.removeEventListener("pointermove", onPointer); };
  }, []);

  useEffect(() => {
    if (reduceMotion || !hydrated) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    void Promise.all([import("lenis"), import("gsap"), import("gsap/ScrollTrigger")]).then(([lenisModule, gsapModule, scrollModule]) => {
      if (disposed) return;
      const lenis = new lenisModule.default({ lerp: 0.08, smoothWheel: true });
      const gsap = gsapModule.gsap;
      gsap.registerPlugin(scrollModule.ScrollTrigger);
      const tick = (time: number) => { lenis.raf(time * 1000); };
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      const media = gsap.matchMedia();
      media.add("(min-width: 900px)", () => {
        const section = document.querySelector<HTMLElement>("#work");
        const track = document.querySelector<HTMLElement>(".work-track");
        if (!section || !track || track.scrollWidth <= track.clientWidth) return;
        const tween = gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth + 64),
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: () => `+=${track.scrollWidth - window.innerWidth}`, scrub: 0.6, pin: true, invalidateOnRefresh: true },
        });
        return () => tween.scrollTrigger?.kill();
      });
      cleanup = () => { media.revert(); gsap.ticker.remove(tick); lenis.destroy(); };
    }).catch(() => undefined);
    return () => { disposed = true; cleanup?.(); };
  }, [hydrated, reduceMotion, projects.length]);

  const featured = useMemo(() => projects.filter((project) => project.project_type === "client" || project.project_type === "product").sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)), [projects]);
  const lab = useMemo(() => projects.filter((project) => project.project_type === "personal" || project.project_type === "academic").sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0)), [projects]);

  const setTheme = () => {
    setDark((current) => {
      const next = !current;
      window.localStorage.setItem("notebook-theme", next ? "dark" : "light");
      return next;
    });
  };
  const copyEmail = async () => {
    if (!profile?.email) return;
    try { await navigator.clipboard.writeText(profile.email); toast.success("Copied"); }
    catch { toast.error("Unable to copy email"); }
  };

  const links = [{ name: "Work", href: "#work" }, { name: "Lab", href: "#lab" }, { name: "About", href: "#about" }, { name: "Contact", href: "#contact" }];

  return (
    <div className={`notebook-shell ${dark ? "notebook-dark" : ""}`}>
      <header className="notebook-nav">
        <a href="#top" className="monogram" aria-label="Yash Sakariya, home">YS</a>
        <nav className="notebook-links" aria-label="Main navigation">
          {links.map((link) => <a key={link.name} href={link.href}>{link.name}</a>)}
        </nav>
        <div className="nav-utilities">
          <div className="clock-block"><span>{clock || "--:--:--"} IST</span><span>Gujarat, India</span></div>
          <span className="availability"><i /> Open to AI Engineer roles</span>
          <Button variant="ghost" size="icon" aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} onClick={setTheme}>{dark ? <Sun /> : <Moon />}</Button>
          {profile?.resume_url ? <a className="resume-link" href={profile.resume_url} target="_blank" rel="noreferrer">Résumé <ArrowUpRight size={14} /></a> : null}
        </div>
        <Button variant="ghost" size="icon" className="mobile-menu-trigger" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <X /> : <Menu />}</Button>
        {menuOpen && <nav className="mobile-menu" aria-label="Mobile navigation">{links.map((link) => <a key={link.name} href={link.href} onClick={() => setMenuOpen(false)}>{link.name}</a>)}{profile?.resume_url ? <a href={profile.resume_url} target="_blank" rel="noreferrer">Résumé</a> : null}</nav>}
      </header>

      <main>
        <section id="top" className="notebook-section tone-paper hero-section">
          <div className="hero-grain" aria-hidden="true" />
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">AI + BACKEND ENGINEER <span>·</span> FIG. 01 — SIGNAL FIELD</p>
              <h1>I build AI systems<br />businesses <em>actually</em><br />run on.</h1>
              <p className="hero-subline">AI + Backend Engineer at Pucho.ai. Cited RAG, LLM and OCR workflows, PostgreSQL backends, from architecture to deployment.</p>
              <div className="hero-actions">
                <a className="action-link action-primary magnetic" href="#work" data-cursor="View work">See selected work <ArrowDownRight size={18} /></a>
                {profile?.resume_url ? <a className="action-link action-secondary magnetic" href={profile.resume_url} target="_blank" rel="noreferrer">Download résumé <ArrowUpRight size={16} /></a> : null}
              </div>
              <div className="hero-meta"><span className="availability"><i /> Open to AI Engineer roles</span><span>{profile?.location ?? "Gujarat, India"}</span></div>
            </div>
            <div className="signal-figure" aria-label="Abstract network of connected data points">
              <div className="signal-fallback" aria-hidden="true"><svg viewBox="0 0 520 440" role="img"><g className="signal-lines"><path d="M60 90 180 44 290 108 420 56M60 90 125 218 290 108 354 252 420 56M125 218 54 350 210 310 354 252 445 356M210 310 290 108M125 218 354 252M54 350 136 414 210 310 445 356" /></g><g className="signal-dots">{[[60,90],[180,44],[290,108],[420,56],[125,218],[354,252],[54,350],[210,310],[445,356],[136,414]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="3" />)}</g></svg></div>
              {hydrated && !reduceMotion ? <Suspense fallback={null}><SignalField /></Suspense> : null}
              <div className="figure-caption">FIG. 01 <span>Signal field / system map</span></div>
            </div>
          </div>
        </section>

        <section className="proof-strip tone-paper" aria-label="Selected project outcomes">
          {proof.map(([number, context, project]) => <div className="proof-item" key={number}><strong>{number}</strong><span>{context}</span><small>{project}</small></div>)}
        </section>

        <section id="work" className="notebook-section tone-ink work-section">
          <div className="section-head work-heading"><div><p className="eyebrow">01 / SELECTED WORK</p><h2>Systems in the wild.</h2></div><p className="margin-note">Four systems. Real constraints.<br />Evidence over theater.</p></div>
          <div className="work-rail" aria-label="Selected case studies">
            <div className="work-track" tabIndex={0} aria-label="Scroll through selected case studies">
              {featured.map((project, index) => <WorkCard key={project.id} project={project} index={index} />)}
            </div>
          </div>
          {!featured.length ? <p className="empty-note">Case studies are being prepared.</p> : null}
        </section>

        <section className="notebook-section tone-paper principles-section">
          <div className="section-head"><div><p className="eyebrow">02 / HOW I BUILD</p><h2>Principles, not slogans.</h2></div><p className="margin-note">FIG. 02 — Working principles</p></div>
          <div className="principle-list">{principles.map(([number, title, detail]) => <article className="principle-row" key={number}><span className="mono-number">{number}</span><h3>{title}</h3><p>{detail}</p><ArrowUpRight size={17} aria-hidden="true" /></article>)}</div>
        </section>

        <section id="lab" className="notebook-section tone-ink lab-section">
          <div className="section-head"><div><p className="eyebrow">03 / LAB</p><h2>Questions worth building.</h2></div><p className="margin-note">Personal & academic work</p></div>
          <div className="lab-list">{lab.map((project, index) => <LabRow key={project.id} project={project} index={index} />)}</div>
          {!lab.length ? <p className="empty-note">Lab projects are being prepared.</p> : null}
        </section>

        <section id="experience" className="notebook-section tone-paper experience-section">
          <div className="section-head"><div><p className="eyebrow">04 / EXPERIENCE</p><h2>Built by doing.</h2></div><p className="margin-note">FIG. 03 — Timeline</p></div>
          <div className="timeline-list">{experience.map((item) => <article className="timeline-row" key={item.id}><span className="timeline-date">{item.start_date}{item.end_date ? ` — ${item.end_date}` : ""}</span><div><h3>{item.role}</h3><p className="timeline-org">{item.company}{item.location ? ` · ${item.location}` : ""}</p>{item.description ? <p className="timeline-detail">{item.description}</p> : null}</div><span className={item.is_current ? "timeline-state current" : "timeline-state"}>{item.is_current ? "CURRENT" : item.type?.toUpperCase()}</span></article>)}</div>
        </section>

        <section id="toolkit" className="notebook-section tone-ink toolkit-section">
          <div className="section-head"><div><p className="eyebrow">05 / TOOLKIT</p><h2>A working system map.</h2></div><p className="margin-note">No levels. Just tools.</p></div>
          <div className="toolkit-map">{skillGroups.map((group, index) => <article className="toolkit-group" key={group.title}><span className="toolkit-index">0{index + 1}</span><div><h3>{group.title}</h3><div className="toolkit-chips">{group.values.map((value) => <span key={value}>{value}</span>)}</div></div></article>)}</div>
          {skills.length === 0 ? <p className="empty-note">Skills are being prepared.</p> : null}
        </section>

        <section id="about" className="notebook-section tone-paper about-section">
          <div className="section-head"><div><p className="eyebrow">06 / ABOUT</p><h2>From systems thinking to shipped work.</h2></div><p className="margin-note">Yash Sakariya · Gujarat, India</p></div>
          <div className="about-grid">
            <div className="about-copy"><p>{profile?.summary ?? "AI + Backend Engineer building production AI systems: cited RAG, LLM and OCR workflows, PostgreSQL backends, from architecture to deployment."}</p><p className="education-line">B.Tech Computer Engineering (AI specialization)<br />Ganpat University – U.V. Patel College of Engineering · 2022–2026<br />CGPA 8.39</p></div>
            <div className="about-aside"><p className="eyebrow">LEADERSHIP</p><p>ISA Co-Lead (Documentation)</p><p>NSS Coordinator · 10+ community events</p><p>GVM Social Club · 2 years teaching village students</p><div className="off-keyboard"><span className="eyebrow">OFF THE KEYBOARD</span><span>Garba · Calisthenics · Running · Gujarat · Music</span></div></div>
          </div>
        </section>

        <section id="contact" className="notebook-section tone-ink contact-section">
          <div className="section-head"><div><p className="eyebrow">07 / CONTACT</p><h2>Good systems start<br />with a conversation.</h2></div><p className="margin-note">FIG. 04 — Contact channel</p></div>
          <div className="contact-email-row"><button className="email-copy" onClick={copyEmail} data-cursor="Copy" aria-label={`Copy ${profile?.email ?? "email address"}`}><span>{profile?.email ?? "sakariyayash04@gmail.com"}</span><Copy size={18} /></button><div className="social-row">{profile?.linkedin_url ? <a href={profile.linkedin_url} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a> : null}{profile?.github_url ? <a href={profile.github_url} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a> : null}{profile?.resume_url ? <a href={profile.resume_url} target="_blank" rel="noreferrer">Résumé <ArrowUpRight size={14} /></a> : null}</div></div>
          <Contact profile={profile} />
        </section>
      </main>
      <footer className="notebook-footer tone-ink"><span>Designed and built by Yash Sakariya · 2026</span><a href="#top">Back to top <ArrowUpRight size={14} /></a></footer>
      {hydrated && !reduceMotion && !window.matchMedia("(hover: none)").matches ? <div className={`notebook-cursor ${cursor.label ? "is-active" : ""}`} style={{ transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)` }} aria-hidden="true"><span>{cursor.label}</span></div> : null}
    </div>
  );
}

function WorkCard({ project, index }: { project: NotebookProject; index: number }) {
  const steps = project.architecture_steps ?? [];
  const slug = project.slug;
  return <article className="work-card" data-cursor="View case">
    <div className="work-card-top"><span className="work-index">{String(index + 1).padStart(2, "0")}</span><span className="eyebrow">{project.project_type?.toUpperCase()} / {project.year ?? "CASE STUDY"}</span></div>
    <h3>{project.title}</h3><p className="work-outcome">{project.outcome_line ?? project.description}</p>
    <div className="mini-flow" aria-label={`System flow: ${steps.join(", ")}`}>{steps.slice(0, 4).map((step, stepIndex) => <span key={`${step}-${stepIndex}`}>{step}{stepIndex < Math.min(steps.length, 4) - 1 ? <ArrowRight size={12} /> : null}</span>)}</div>
    <div className="stack-line">{(project.stack?.length ? project.stack : project.tech_stack ?? []).slice(0, 6).map((item) => <span key={item}>{item}</span>)}</div>
    {slug ? <Link to="/work/$slug" params={{ slug }} className="read-case">Read case study <ArrowUpRight size={16} /></Link> : <span className="read-case">Case study soon</span>}
  </article>;
}

function LabRow({ project, index }: { project: NotebookProject; index: number }) {
  return <article className="lab-row" data-cursor="View case"><span className="lab-index">{String(index + 1).padStart(2, "0")}</span><div><h3>{project.title}</h3><p>{project.outcome_line ?? project.description}</p><div className="stack-line">{(project.stack?.length ? project.stack : project.tech_stack ?? []).slice(0, 5).map((item) => <span key={item}>{item}</span>)}</div></div>{project.github_url ? <a href={project.github_url} target="_blank" rel="noreferrer" aria-label={`GitHub for ${project.title}`}><ArrowUpRight size={18} /></a> : <span />}</article>;
}