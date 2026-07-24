import { useEffect, useRef } from "react";
import gsap from "gsap";

/** TRIONN-style custom cursor + magnetic buttons (desktop only). */
export default function LandingCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("landing-cursor-on");
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: pos.x, y: pos.y };

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      gsap.to(dot, { x: pos.x, y: pos.y, duration: 0.12, ease: "power3.out", overwrite: "auto" });
      gsap.to(ringPos, {
        x: pos.x,
        y: pos.y,
        duration: 0.45,
        ease: "power3.out",
        overwrite: "auto",
        onUpdate: () => gsap.set(ring, { x: ringPos.x, y: ringPos.y }),
      });
    };

    const grow = () => {
      gsap.to(ring, { scale: 1.85, opacity: 0.9, duration: 0.35 });
      gsap.to(dot, { scale: 0.55, duration: 0.25 });
    };
    const shrink = () => {
      gsap.to(ring, { scale: 1, opacity: 0.55, duration: 0.35 });
      gsap.to(dot, { scale: 1, duration: 0.25 });
    };

    const pull = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - (r.left + r.width / 2)) * 0.28,
        y: (e.clientY - (r.top + r.height / 2)) * 0.28,
        duration: 0.35,
        ease: "power3.out",
        overwrite: "auto",
      });
    };
    const release = (e: MouseEvent) => {
      gsap.to(e.currentTarget as HTMLElement, {
        x: 0,
        y: 0,
        duration: 0.55,
        ease: "elastic.out(1, 0.45)",
      });
    };

    const wire = () => {
      document.querySelectorAll<HTMLElement>("a, button, [data-magnetic]").forEach((el) => {
        el.addEventListener("mouseenter", grow);
        el.addEventListener("mouseleave", shrink);
      });
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        el.addEventListener("mousemove", pull);
        el.addEventListener("mouseleave", release);
      });
    };
    wire();
    window.addEventListener("mousemove", onMove);

    return () => {
      document.documentElement.classList.remove("landing-cursor-on");
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="landing-cursor-ring" aria-hidden />
      <div ref={dotRef} className="landing-cursor-dot" aria-hidden />
    </>
  );
}
