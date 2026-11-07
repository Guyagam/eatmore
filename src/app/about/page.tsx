import type { Metadata } from "next";
import Logo from "@/components/brand/Logo";
import MagneticButton from "@/components/motion/MagneticButton";
import { Container, SectionHead } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "מי אני",
  description: "איך אני מדרגת, מה אני לא מקבלת בחינם, ולמה אפשר לסמוך על מה שכתוב כאן.",
};

const SCALE = [
  { range: "9–10", label: "תזמינו עכשיו", text: "ארוחה שאני עדיין חושבת עליה שבוע אחרי." },
  { range: "8–8.9", label: "תלכו", text: "טוב מאוד, במחיר הוגן. רוב ההמלצות שלי יושבות כאן." },
  { range: "7–7.9", label: "שווה אם אתם באזור", text: "משהו אחד מצוין, השאר בסדר." },
  { range: "6–6.9", label: "אפשר לוותר", text: "לא רע, אבל יש טוב יותר באותו מחיר." },
  { range: "עד 6", label: "לא שווה", text: "לא הייתי חוזרת, ולא הייתי שולחת אתכם." },
];

const RULES = [
  "אני משלמת על הארוחות שלי. כשמסעדה מזמינה אותי, זה כתוב בראש הביקורת בגדול.",
  "אני לא מודיעה מראש שאני מגיעה.",
  "אני לא כותבת על מקום אחרי ביקור אחד אם משהו השתבש בצורה חריגה — אני חוזרת.",
  "אם מקום משתפר, אני מעדכנת את הציון ומשאירה את הגרסה הקודמת גלויה.",
  "מחיר שמופיע באתר הוא מה ששילמתי בפועל לסועד, כולל שתייה, בלי טיפ.",
];

export default function AboutPage() {
  return (
    <Container className="py-12">
      <div className="flex flex-wrap items-center gap-8">
        <Logo variant="full" size={56} />
      </div>

      <div className="mt-12 max-w-[62ch]">
        <h1 className="font-display text-[clamp(42px,8vw,86px)] font-bold leading-[0.9]">
          אני הולכת בשבילכם
        </h1>
        <div className="mt-6 grid gap-5 text-[1.07rem] leading-[1.75]">
          <p className="m-0">
            קוראים לי מור. התחלתי לכתוב על מסעדות כי נמאס לי לקרוא המלצות שנשמעות כאילו מישהו
            שילם עליהן, וללכת בעקבותיהן ולהתאכזב.
          </p>
          <p className="m-0">
            האתר הזה הוא הארכיון של כל מקום שהייתי בו. לכל ביקורת יש ציון, מחיר אמיתי לסועד,
            והכרעה אחת ברורה: שווה או לא שווה. אם לא ברור לכם מה אני חושבת על מקום, לא עשיתי
            את העבודה שלי.
          </p>
        </div>
      </div>

      <section className="mt-16" aria-labelledby="scale-h">
        <SectionHead kicker="שקיפות" title="איך אני מדרגת" id="scale-h" />
        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse text-[0.97rem]">
            <thead>
              <tr>
                <th className="border-b border-line py-3 pe-4 text-start font-data text-[11.5px] font-black tracking-[0.1em] text-muted">
                  ציון
                </th>
                <th className="border-b border-line py-3 pe-4 text-start font-data text-[11.5px] font-black tracking-[0.1em] text-muted">
                  מה זה אומר
                </th>
                <th className="border-b border-line py-3 text-start font-data text-[11.5px] font-black tracking-[0.1em] text-muted">
                  בפועל
                </th>
              </tr>
            </thead>
            <tbody>
              {SCALE.map((s) => (
                <tr key={s.range}>
                  <td className="tnum whitespace-nowrap border-b border-line py-3.5 pe-4 font-data font-black">
                    {s.range}
                  </td>
                  <td className="whitespace-nowrap border-b border-line py-3.5 pe-4 font-extrabold">
                    {s.label}
                  </td>
                  <td className="border-b border-line py-3.5 text-muted">{s.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="rules-h">
        <SectionHead kicker="הכללים" title="מה שאני מתחייבת אליו" id="rules-h" />
        <ul className="mt-8 grid max-w-[64ch] gap-4">
          {RULES.map((r) => (
            <li
              key={r}
              className="border-s-[3px] border-chili ps-4 text-[1.02rem] leading-relaxed"
            >
              {r}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-14 flex flex-wrap gap-3">
        <MagneticButton href="/reviews">לכל הביקורות</MagneticButton>
        <MagneticButton href="/submit" variant="ghost">
          שלחו לי מסעדה
        </MagneticButton>
      </div>
    </Container>
  );
}
