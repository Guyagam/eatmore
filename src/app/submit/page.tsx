import type { Metadata } from "next";
import { Container, SectionHead } from "@/components/ui/Section";
import { allCities } from "@/lib/content";

export const metadata: Metadata = {
  title: "שלחו לי מסעדה",
  description: "יש מקום שאתם רוצים שאבדוק? שלחו אותו ואוסיף אותו לתור.",
};

export default function SubmitPage() {
  const cities = allCities();

  return (
    <Container className="py-12">
      <div className="max-w-[56ch]">
        <SectionHead
          kicker="התור שלי"
          title="שלחו לי מסעדה"
          level={1}
          lede="רוב הביקורות כאן התחילו מהודעה של מישהו. אני קוראת הכול, גם אם אני לא מספיקה לענות."
        />

        <form className="mt-10 grid gap-5" action="/api/submit" method="post">
          <div className="grid gap-2">
            <label htmlFor="place" className="font-data text-[12px] font-black tracking-[0.1em] text-muted">
              שם המקום
            </label>
            <input
              id="place"
              name="place"
              required
              className="min-h-[48px] rounded-sm border border-line bg-paper px-3.5 text-[15px] outline-none focus:border-ink"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="city" className="font-data text-[12px] font-black tracking-[0.1em] text-muted">
              עיר
            </label>
            <input
              id="city"
              name="city"
              list="city-list"
              required
              className="min-h-[48px] rounded-sm border border-line bg-paper px-3.5 text-[15px] outline-none focus:border-ink"
            />
            <datalist id="city-list">
              {cities.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div className="grid gap-2">
            <label htmlFor="why" className="font-data text-[12px] font-black tracking-[0.1em] text-muted">
              למה דווקא שם
            </label>
            <textarea
              id="why"
              name="why"
              rows={4}
              className="rounded-sm border border-line bg-paper p-3.5 text-[15px] outline-none focus:border-ink"
            />
            <p className="m-0 text-[0.85rem] text-muted">
              מנה ספציפית שאהבתם עוזרת יותר מ״הכול טעים״.
            </p>
          </div>

          <button
            type="submit"
            className="min-h-[52px] rounded-sm bg-chili px-7 font-data text-[15px] font-black text-on-accent transition-colors duration-200 hover:bg-ink"
          >
            שליחה
          </button>
        </form>
      </div>
    </Container>
  );
}
