"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/brand/Logo";

const NAV = [
  { href: "/reviews", label: "כל הביקורות" },
  { href: "/guides", label: "מדריכים" },
  { href: "/abroad", label: "חו״ל" },
  { href: "/about", label: "מי אני" },
  { href: "/for-restaurants", label: "למסעדות" },
];

/**
 * Hides on scroll down, returns on scroll up. The frosted background fades in
 * after 80px so the header never sits as a bar over the cover photograph.
 */
export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 80);
      setHidden(y > 260 && y > lastY.current);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed inset-x-0 z-50 transition-[transform,background-color,border-color,backdrop-filter] duration-300 ease-[var(--ease-out)]",
        hidden && !open ? "-translate-y-full" : "translate-y-0",
        solid || open
          ? "border-b border-line bg-paper/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
      style={{ top: 0, paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 py-3 ps-[max(16px,env(safe-area-inset-left,0px))] pe-[max(16px,env(safe-area-inset-right,0px))]">
        <Link
          href="/"
          aria-label="אוכלים עם מור — לעמוד הבית"
          className="flex min-h-[44px] min-w-[44px] shrink-0 items-center"
        >
          <Logo variant="mark" size={38} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="ניווט ראשי">
          {NAV.map((item) => {
            const on = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={on ? "page" : undefined}
                className={[
                  "rounded-sm px-3 py-2 font-data text-[14px] font-bold transition-colors duration-200",
                  on ? "text-chili" : "text-ink/75 hover:text-ink",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/submit"
            className="ms-2 rounded-sm border-2 border-ink px-4 py-2 font-data text-[14px] font-black transition-colors duration-200 hover:bg-ink hover:text-paper"
          >
            שלחו לי מסעדה
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="flex h-11 w-11 items-center justify-center rounded-sm border border-line md:hidden"
        >
          <span className="sr-only">{open ? "סגירת התפריט" : "פתיחת התפריט"}</span>
          <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
            <rect y="0" width="20" height="2" fill="currentColor" />
            <rect y="6" width="20" height="2" fill="currentColor" />
            <rect y="12" width="20" height="2" fill="currentColor" />
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="ניווט ראשי"
          className="border-t border-line bg-paper px-[max(16px,env(safe-area-inset-left,0px))] pb-4 md:hidden"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block border-b border-line py-3 font-data text-[15px] font-bold last:border-0"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/submit"
            className="mt-3 block rounded-sm bg-chili px-4 py-3 text-center font-data text-[15px] font-black text-white"
          >
            שלחו לי מסעדה
          </Link>
        </nav>
      )}
    </header>
  );
}
