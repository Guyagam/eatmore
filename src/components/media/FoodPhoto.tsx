import type { Tone } from "@/lib/types";

/**
 * Placeholder photography.
 *
 * Mor's real close-ups are the heart of the site; until they're in, each review
 * renders a warm gradient keyed to its dish type so layout, contrast and the
 * darkening scrim can all be judged for real.
 *
 * TO SWAP IN REAL PHOTOS: replace the inner <span> with next/image
 * (`fill`, `sizes`, `priority` on the home cover only). The scrim and the
 * `grain` class below stay exactly as they are — they're what keeps the white
 * cover type readable at 4.5:1 over any photograph.
 */

const TONES: Record<Tone, string> = {
  burger: "radial-gradient(130% 95% at 30% 20%, #F0B23C 0%, #C9601C 42%, #6E2A12 100%)",
  ramen: "radial-gradient(125% 95% at 70% 25%, #E8C77A 0%, #A8622B 38%, #2F1A12 100%)",
  sweet: "radial-gradient(125% 90% at 40% 25%, #F6DCCB 0%, #E0788B 45%, #7A2742 100%)",
  green: "radial-gradient(125% 95% at 35% 25%, #D8E07A 0%, #4E8C3F 42%, #17331A 100%)",
  coffee: "radial-gradient(125% 95% at 60% 22%, #E3C4A0 0%, #8A5A36 40%, #2A1710 100%)",
  pizza: "radial-gradient(130% 95% at 45% 22%, #F2D27A 0%, #CF4A2A 45%, #5E1B14 100%)",
};

interface Props {
  tone: Tone;
  /** Adds the top-to-bottom darkening scrim that white cover type needs. */
  scrim?: boolean;
  className?: string;
  /** Applied to the moving layer, so parent hover/scroll can scale it. */
  innerClassName?: string;
}

export default function FoodPhoto({
  tone,
  scrim = false,
  className = "",
  innerClassName = "",
}: Props) {
  return (
    <span className={`grain pointer-events-none absolute inset-0 block overflow-hidden ${className}`}>
      <span
        className={`absolute inset-0 block ${innerClassName}`}
        style={{ backgroundImage: TONES[tone] }}
      />
      {scrim && (
        <span
          className="absolute inset-0 block"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,.18) 0%, rgba(0,0,0,.42) 100%)",
          }}
        />
      )}
    </span>
  );
}
