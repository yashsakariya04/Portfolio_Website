import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/portfolio/Navbar";
import { Ambient, ScrollProgress } from "@/components/portfolio/Ambient";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Skills } from "@/components/portfolio/Skills";
import { Projects } from "@/components/portfolio/Projects";
import { Experience } from "@/components/portfolio/Experience";
import { Achievements } from "@/components/portfolio/Achievements";
import { Community } from "@/components/portfolio/Community";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import {
  fetchProfile,
  fetchProjects,
  fetchSkills,
  fetchExperience,
  fetchAchievements,
} from "@/lib/queries";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const profile = useQuery({ queryKey: ["profile"], queryFn: fetchProfile });
  const projects = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });
  const skills = useQuery({ queryKey: ["skills"], queryFn: fetchSkills });
  const experience = useQuery({ queryKey: ["experience"], queryFn: fetchExperience });
  const achievements = useQuery({ queryKey: ["achievements"], queryFn: fetchAchievements });

  const counts = {
    projects: projects.data?.length ?? 0,
    skills: skills.data?.length ?? 0,
    achievements: achievements.data?.length ?? 0,
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <Ambient />
      <ScrollProgress />
      <Navbar />
      <div className="relative z-10">
      <Hero profile={profile.data ?? null} counts={counts} />
      <About profile={profile.data ?? null} />
      <Experience items={experience.data ?? []} />
      <Skills skills={skills.data ?? []} />
      <Projects projects={projects.data ?? []} />
      <Achievements items={achievements.data ?? []} />
      <Community />
      <Contact profile={profile.data ?? null} />
      <Footer profile={profile.data ?? null} />
      </div>
    </main>
  );
}
