import { supabase } from "@/integrations/supabase/client";

export async function fetchProfile() {
  const { data } = await supabase.from("profile").select("*").limit(1).maybeSingle();
  return data;
}
export async function fetchProjects() {
  const { data } = await supabase.from("projects").select("*").order("order_index");
  return data ?? [];
}
export async function fetchSkills() {
  const { data } = await supabase.from("skills").select("*").order("order_index");
  return data ?? [];
}
export async function fetchExperience() {
  const { data } = await supabase.from("experience").select("*").order("order_index");
  return data ?? [];
}
export async function fetchGallery() {
  const { data } = await supabase.from("gallery").select("*").order("order_index");
  return data ?? [];
}
export async function fetchAchievements() {
  const { data } = await supabase.from("achievements").select("*");
  return data ?? [];
}