import type { ReactNode } from "react";

/** The page gutter. One place, so every band lines up. */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto max-w-[1240px] ps-[max(16px,env(safe-area-inset-left,0px))] pe-[max(16px,env(safe-area-inset-right,0px))] ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHead({
  kicker,
  title,
  lede,
  id,
}: {
  kicker?: string;
  title: string;
  lede?: string;
  id?: string;
}) {
  return (
    <div className="max-w-[62ch]">
      {kicker && (
        <p className="m-0 font-data text-[12px] font-black tracking-[0.15em] text-chili">
          {kicker}
        </p>
      )}
      <h2
        id={id}
        className="mt-2 font-display text-[clamp(34px,5.6vw,62px)] font-bold leading-[0.95]"
      >
        {title}
      </h2>
      {lede && <p className="mt-3 text-[1.03rem] text-muted">{lede}</p>}
    </div>
  );
}
