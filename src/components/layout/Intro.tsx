"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Logo from "@/components/brand/Logo";

/**
 * The entry sequence.
 *
 * Rules it obeys, all of them non-negotiable:
 *  · once per session, never on a repeat visit or a client-side navigation
 *  · never under reduced motion
 *  · hard ceiling of 1.4s
 *  · skippable with a click, Esc, or Tab
 *  · the page underneath is fully rendered the whole time — this is a curtain
 *    over finished content, never a loading gate.
 */
export default function Intro() {
  const [show, setShow] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    const el = root.current;
    if (!el) {
      setShow(false);
      return;
    }
    gsap
      .timeline({ onComplete: () => setShow(false) })
      .to(el.querySelector(".intro-logo"), { opacity: 0, scale: 0.94, duration: 0.25 })
      .to(el.querySelector(".intro-top"), { yPercent: -100, duration: 0.7, ease: "expo.inOut" }, 0.1)
      .to(
        el.querySelector(".intro-bottom"),
        { yPercent: 100, duration: 0.7, ease: "expo.inOut" },
        0.1
      );
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (sessionStorage.getItem("eatmore:intro") === "1") return;
      sessionStorage.setItem("eatmore:intro", "1");
    } catch {
      // Private mode or blocked storage: show it this once and move on.
    }
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    document.body.style.overflow = "hidden";
    const ceiling = window.setTimeout(finish, 1400);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Tab") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.clearTimeout(ceiling);
      window.removeEventListener("keydown", onKey);
    };
  }, [show, finish]);

  if (!show) return null;

  return (
    <div
      ref={root}
      onClick={finish}
      aria-hidden="true"
      className="fixed inset-0 z-[100] cursor-pointer"
    >
      <div className="intro-top absolute inset-x-0 top-0 h-1/2 bg-chili" />
      <div className="intro-bottom absolute inset-x-0 bottom-0 h-1/2 bg-chili" />
      <div className="intro-logo absolute inset-0 flex items-center justify-center">
        <Logo variant="inverse" size={64} animate />
      </div>
    </div>
  );
}
