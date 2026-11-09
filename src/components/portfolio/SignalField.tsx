import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function SignalField() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower = window.matchMedia("(max-width: 700px)").matches || navigator.hardwareConcurrency < 4;
    if (reduced || lowPower) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "low-power" });
    } catch {
      return;
    }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 15;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const count = 1150;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      phases[i] = Math.random() * Math.PI * 2;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const points = new THREE.Points(
      geometry,
      new THREE.PointsMaterial({ color: 0xff4d1a, size: 0.025, transparent: true, opacity: 0.7, depthWrite: false }),
    );
    scene.add(points);
    const pointer = new THREE.Vector2(0, 0);
    const onPointerMove = (event: PointerEvent) => {
      const bounds = host.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    };
    host.addEventListener("pointermove", onPointerMove, { passive: true });

    let frame = 0;
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? false; });
    observer.observe(host);
    const draw = (time: number) => {
      frame = requestAnimationFrame(draw);
      if (!visible || document.hidden) return;
      const current = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i += 1) {
        current[i * 3 + 1] += Math.sin(time * 0.0003 + phases[i]) * 0.0007;
        current[i * 3] += Math.cos(time * 0.00025 + phases[i]) * 0.00045;
      }
      geometry.attributes.position.needsUpdate = true;
      points.rotation.y = pointer.x * 0.035;
      points.rotation.x = pointer.y * 0.025;
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(draw);
    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      geometry.dispose();
      points.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="signal-field" aria-hidden="true" />;
}