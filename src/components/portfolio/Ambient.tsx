import { useEffect, useRef } from "react";

/** Fixed dot-grid + cursor-follow indigo spotlight for dark sections. */
export function Ambient() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;
    // Skip on touch / reduced-motion for perf + preference
    const isTouch = window.matchMedia("(hover: none)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduced) return;

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 3;
    let cx = tx;
    let cy = ty;
    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.setProperty("--mx", `${cx}px`);
      el.style.setProperty("--my", `${cy}px`);
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 dot-grid-fixed" />
      <div ref={ref} className="pointer-events-none fixed inset-0 z-0 cursor-spotlight" />
    </>
  );
}

/** Thin indigo→cyan gradient bar that fills with scroll progress. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? (h.scrollTop / max) * 100 : 0;
      el.style.transform = `scaleX(${p / 100})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-[2px] bg-transparent pointer-events-none">
      <div
        ref={ref}
        className="h-full origin-left gradient-accent"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}