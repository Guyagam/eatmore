import Link from "next/link";
import Logo from "@/components/brand/Logo";

const COLUMNS = [
  {
    title: "לאכול",
    links: [
      { href: "/reviews", label: "כל הביקורות" },
      { href: "/guides", label: "מדריכים" },
      { href: "/abroad", label: "חו״ל" },
    ],
  },
  {
    title: "מאחורי הקלעים",
    links: [
      { href: "/about", label: "מי אני ואיך אני מדרגת" },
      { href: "/for-restaurants", label: "למסעדות" },
      { href: "/submit", label: "שלחו לי מסעדה" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-[1240px] gap-12 py-14 ps-[max(16px,env(safe-area-inset-left,0px))] pe-[max(16px,env(safe-area-inset-right,0px))] md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo variant="full" size={34} />
          <p className="mt-5 max-w-[34ch] text-[0.95rem] leading-relaxed text-muted">
            בודקת מסעדות בארץ ובעולם בשביל שאתם לא תלכו ותתאכזבו. אומרת את כל האמת בפנים, גם
            כשזה לא נעים.
          </p>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="mb-4 font-data text-[11.5px] font-black tracking-[0.13em] text-muted">
              {col.title}
            </h2>
            <ul className="grid gap-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[0.95rem] transition-colors duration-200 hover:text-chili"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 py-5 ps-[max(16px,env(safe-area-inset-left,0px))] pe-[max(16px,env(safe-area-inset-right,0px))]">
          <p className="m-0 font-data text-[12.5px] text-muted">
            © {new Date().getFullYear()} אוכלים עם מור
          </p>
          <a
            href="https://www.instagram.com/eat.mor.e"
            target="_blank"
            rel="noopener noreferrer"
            dir="ltr"
            className="font-data text-[12.5px] font-bold tracking-[0.08em] text-muted transition-colors duration-200 hover:text-chili"
          >
            @EAT.MOR.E
          </a>
        </div>
      </div>
    </footer>
  );
}
