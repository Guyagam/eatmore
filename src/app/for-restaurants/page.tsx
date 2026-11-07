import type { Metadata } from "next";
import { Container, SectionHead } from "@/components/ui/Section";
import { allReviews } from "@/lib/content";

export const metadata: Metadata = {
  title: "למסעדות",
  description: "שיתופי פעולה, נתוני קהל, ואיך זה עובד — בנפרד לגמרי מהביקורות.",
};

const PACKAGES = [
  {
    name: "ביקור מסומן",
    price: "לפי פנייה",
    what: "ריל אחד ופוסט אחד, מסומנים כשיתוף פעולה בגוף התוכן ובאתר.",
    note: "הציון עדיין שלי. אם לא אהבתי, זה מה שייכתב.",
  },
  {
    name: "אירוע השקה",
    price: "לפי פנייה",
    what: "סיקור בזמן אמת בסטוריז, ריל סיכום, ועמוד ייעודי באתר.",
    note: "דורש תיאום שבועיים מראש.",
  },
  {
    name: "תוכן לשימוש המסעדה",
    price: "לפי פנייה",
    what: "צילום ועריכה של חמישה סרטונים קצרים לשימוש חופשי בערוצים שלכם.",
    note: "לא מתפרסם אצלי, ולכן לא נחשב ביקורת.",
  },
];

const AUDIENCE = [
  { k: "עוקבים", v: "3,247" },
  { k: "קהל עיקרי", v: "נשים 25–44, מרכז והשפלה" },
  { k: "חשיפה ממוצעת לריל", v: "11,400" },
  { k: "שמירות לריל מוביל", v: "1,180" },
];

export default function ForRestaurantsPage() {
  const total = allReviews().length;

  return (
    <Container className="py-12">
      <SectionHead
        kicker="למסעדות"
        title="לעבוד ביחד"
        lede="לפני הכול: שיתוף פעולה קונה חשיפה, לא ציון. זה כתוב כאן כדי שלא תהיה אי־הבנה אחר כך."
      />

      <section className="mt-12" aria-labelledby="audience-h">
        <h2
          id="audience-h"
          className="font-data text-[11.5px] font-black tracking-[0.13em] text-muted"
        >
          הקהל
        </h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCE.map((a) => (
            <div key={a.k} className="rounded-md bg-surface p-5">
              <dt className="font-data text-[11.5px] font-black tracking-[0.1em] text-muted">
                {a.k}
              </dt>
              <dd className="tnum m-0 mt-2 font-data text-[26px] font-black leading-tight">
                {a.v}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[0.88rem] text-muted">
          הנתונים מתעדכנים ידנית אחת לחודש. {total} ביקורות פורסמו עד היום.
        </p>
      </section>

      <section className="mt-16" aria-labelledby="packages-h">
        <SectionHead kicker="חבילות" title="מה אפשר להזמין" id="packages-h" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {PACKAGES.map((p) => (
            <div
              key={p.name}
              className="flex flex-col rounded-lg border border-line bg-paper p-6"
            >
              <h3 className="m-0 text-[1.2rem] font-extrabold">{p.name}</h3>
              <p className="m-0 mt-1 font-data text-[13px] font-bold text-chili">{p.price}</p>
              <p className="m-0 mt-4 text-[0.97rem] leading-relaxed">{p.what}</p>
              <p className="m-0 mt-auto pt-5 text-[0.88rem] leading-snug text-muted">{p.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 max-w-[56ch]" aria-labelledby="contact-h">
        <SectionHead kicker="פנייה" title="נדבר" id="contact-h" />
        <form className="mt-8 grid gap-4" action="/api/contact" method="post">
          <div className="grid gap-2">
            <label htmlFor="rest" className="font-data text-[12px] font-black tracking-[0.1em] text-muted">
              שם המסעדה
            </label>
            <input
              id="rest"
              name="restaurant"
              required
              className="min-h-[48px] rounded-sm border border-line bg-paper px-3.5 text-[15px] outline-none focus:border-ink"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="cemail" className="font-data text-[12px] font-black tracking-[0.1em] text-muted">
              מייל ליצירת קשר
            </label>
            <input
              id="cemail"
              name="email"
              type="email"
              required
              dir="ltr"
              autoComplete="email"
              className="min-h-[48px] rounded-sm border border-line bg-paper px-3.5 text-[15px] outline-none focus:border-ink"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="msg" className="font-data text-[12px] font-black tracking-[0.1em] text-muted">
              מה אתם מחפשים
            </label>
            <textarea
              id="msg"
              name="message"
              rows={5}
              className="rounded-sm border border-line bg-paper p-3.5 text-[15px] outline-none focus:border-ink"
            />
            <p className="m-0 text-[0.85rem] text-muted">
              ככל שתכתבו יותר — תאריך, סוג האירוע, תקציב — כך אוכל לענות מהר יותר.
            </p>
          </div>
          <button
            type="submit"
            className="min-h-[52px] rounded-sm bg-chili px-7 font-data text-[15px] font-black text-white transition-colors duration-200 hover:bg-ink"
          >
            שליחת הפנייה
          </button>
        </form>
      </section>
    </Container>
  );
}
