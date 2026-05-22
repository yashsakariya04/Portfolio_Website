import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Github, Linkedin, Send } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { supabase } from "@/integrations/supabase/client";

type Profile = {
  email?: string | null;
  phone?: string | null;
  location?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  availability_status?: string | null;
};

export function Contact({ profile }: { profile: Profile | null }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in name, email, and message");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert(form);
    setLoading(false);
    if (error) {
      toast.error("Failed to send. Try again.");
      return;
    }
    toast.success("Message sent! I'll reply soon 🚀");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section id="contact" className="py-28 px-6 max-w-7xl mx-auto">
      <SectionHeading tag="< Contact />" title="Let's Build Something" subtitle="Reach out for roles, collaborations, or just a chat about AI." />
      <div className="grid md:grid-cols-2 gap-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="font-mono text-xs text-cyan mb-3">// I'm open to</div>
          <ul className="space-y-1.5 mb-8 text-sm text-muted-foreground">
            {["Full-time roles", "Internships", "Freelance AI projects", "Collaborations", "Open source"].map((x) => (
              <li key={x} className="flex items-center gap-2">
                <span className="text-cyan">›</span> {x}
              </li>
            ))}
          </ul>
          <div className="space-y-3 mb-6">
            {profile?.email && <Row icon={<Mail size={16} />} value={profile.email} href={`mailto:${profile.email}`} />}
            {profile?.phone && <Row icon={<Phone size={16} />} value={profile.phone} />}
            {profile?.location && <Row icon={<MapPin size={16} />} value={profile.location} />}
          </div>
          <div className="flex gap-3 mb-6">
            {profile?.github_url && (
              <a href={profile.github_url} target="_blank" rel="noreferrer" className="p-2.5 rounded-full border border-border hover:border-cyan hover:text-cyan transition-colors">
                <Github size={16} />
              </a>
            )}
            {profile?.linkedin_url && (
              <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="p-2.5 rounded-full border border-border hover:border-cyan hover:text-cyan transition-colors">
                <Linkedin size={16} />
              </a>
            )}
          </div>
          {profile?.availability_status && (
            <div className="inline-flex items-center gap-2 chip chip-cyan">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" /> {profile.availability_status}
            </div>
          )}
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          onSubmit={submit}
          className="card-tech p-6 space-y-4"
        >
          {(["name", "email", "subject"] as const).map((f) => (
            <Input key={f} placeholder={f[0].toUpperCase() + f.slice(1)} value={form[f]} onChange={(v) => setForm({ ...form, [f]: v })} type={f === "email" ? "email" : "text"} />
          ))}
          <textarea
            placeholder="Your message"
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full gradient-accent text-primary-foreground font-medium hover:scale-[1.02] transition-transform disabled:opacity-60"
          >
            {loading ? "Sending..." : (<><Send size={16} /> Send Message</>)}
          </button>
        </motion.form>
      </div>
    </section>
  );
}

function Row({ icon, value, href }: { icon: React.ReactNode; value: string; href?: string }) {
  const inner = (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-cyan">{icon}</span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
  return href ? <a href={href} className="hover:text-cyan transition-colors block">{inner}</a> : inner;
}

function Input({ placeholder, value, onChange, type = "text" }: { placeholder: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan transition-colors"
    />
  );
}