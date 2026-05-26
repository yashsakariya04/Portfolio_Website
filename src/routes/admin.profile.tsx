import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Field, TextInput, TextArea, FileDrop, TagInput, Select,
  formCardCls, btnPrimary,
} from "@/components/admin/Fields";

export const Route = createFileRoute("/admin/profile")({ component: ProfilePage });

const AVAILABILITY = ["Open to Work", "Open to Freelance", "Not Available", "Open to Collaborations"];

function ProfilePage() {
  const { data, refetch } = useQuery({
    queryKey: ["adminProfile"],
    queryFn: async () => {
      const { data } = await supabase.from("profile").select("*").limit(1).maybeSingle();
      return data;
    },
  });
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
    else if (data === null) setForm({
      name: "", title: "", taglines: [], summary: "",
      email: "", phone: "", location: "",
      github_url: "", linkedin_url: "", availability_status: "Open to Work",
      profile_photo_url: null, resume_url: null,
    });
  }, [data]);

  if (!form) return <AdminLayout title="Profile"><div className="text-muted-foreground">Loading…</div></AdminLayout>;

  const set = (k: string, v: any) => setForm({ ...form, [k]: v });

  const save = async () => {
    setSaving(true);
    const payload = { ...form };
    let res;
    if (form.id) res = await supabase.from("profile").update(payload).eq("id", form.id);
    else res = await supabase.from("profile").insert(payload);
    setSaving(false);
    if (res.error) return toast.error(res.error.message);
    toast.success("Profile saved");
    refetch();
  };

  return (
    <AdminLayout title="Profile">
      <div className="space-y-6 max-w-3xl">
        <div className={formCardCls}>
          <h2 className="font-display text-lg font-semibold">Identity</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name"><TextInput value={form.name ?? ""} onChange={(v) => set("name", v)} /></Field>
            <Field label="Title"><TextInput value={form.title ?? ""} onChange={(v) => set("title", v)} /></Field>
          </div>
          <Field label="Taglines (cycle through hero animation)">
            <TagInput tags={form.taglines ?? []} onChange={(t) => set("taglines", t)} placeholder="Add tagline + Enter" />
          </Field>
          <Field label="Summary / Bio"><TextArea rows={6} value={form.summary ?? ""} onChange={(v) => set("summary", v)} /></Field>
        </div>

        <div className={formCardCls}>
          <h2 className="font-display text-lg font-semibold">Contact</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Email"><TextInput type="email" value={form.email ?? ""} onChange={(v) => set("email", v)} /></Field>
            <Field label="Phone"><TextInput value={form.phone ?? ""} onChange={(v) => set("phone", v)} /></Field>
            <Field label="Location"><TextInput value={form.location ?? ""} onChange={(v) => set("location", v)} /></Field>
            <Field label="Availability">
              <Select value={form.availability_status ?? "Open to Work"} onChange={(v) => set("availability_status", v)} options={AVAILABILITY} />
            </Field>
            <Field label="GitHub URL"><TextInput value={form.github_url ?? ""} onChange={(v) => set("github_url", v)} /></Field>
            <Field label="LinkedIn URL"><TextInput value={form.linkedin_url ?? ""} onChange={(v) => set("linkedin_url", v)} /></Field>
          </div>
        </div>

        <div className={formCardCls}>
          <h2 className="font-display text-lg font-semibold">Media</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Profile photo">
              <FileDrop bucket="profile-photos" value={form.profile_photo_url} onChange={(url) => set("profile_photo_url", url)} accept="image/*" label="Drop a photo" />
            </Field>
            <Field label="Resume (PDF)">
              <FileDrop bucket="resume" value={form.resume_url} onChange={(url) => set("resume_url", url)} accept="application/pdf" label="Drop your resume PDF" />
            </Field>
          </div>
        </div>

        <button onClick={save} disabled={saving} className={btnPrimary}>
          <Save size={14} /> {saving ? "Saving…" : "Save profile"}
        </button>
      </div>
    </AdminLayout>
  );
}