import type { Destination, Guide } from "@/lib/types";

/** SEED CONTENT — see the note in reviews.ts. */
export const GUIDES: Guide[] = [
  {
    slug: "burgers",
    title: "דירוג בורגרים",
    blurb: "אכלתי אחד עשר בורגרים בשלושה חודשים. אלה אלה שנשארו ברשימה, מהטוב לפחות.",
    tone: "burger",
    ranking: ["london-salt-beef", "grill-rafi", "burger-jaffa"],
  },
  {
    slug: "ramen",
    title: "ראמנים ראויים",
    blurb: "לא כל קערה עם ביצה היא ראמן. אלה שעברו את המבחן.",
    tone: "ramen",
    ranking: ["bangkok-boat-noodle", "ramen-shishi", "sinit-mehirim"],
  },
  {
    slug: "sweets",
    title: "קינוחים",
    blurb: "מאפים, קרמים ובצקים. מדורג לפי כמה אני חוזרת.",
    tone: "sweet",
    ranking: ["bakery-matok", "burger-mefunak"],
  },
  {
    slug: "italian",
    title: "איטלקיות",
    blurb: "פסטה שמגולגלת במקום ופיצה שמתקפלת. שני דברים שאפשר לבדוק בביס אחד.",
    tone: "pizza",
    ranking: ["italki-herzliya", "pizza-ny-netanya"],
  },
  {
    slug: "breakfast",
    title: "ארוחות בוקר",
    blurb: "כמה לחם, כמה קעריות, וכמה זה עולה.",
    tone: "coffee",
    ranking: ["boker-ramat-gan", "cafe-halom", "bakery-matok"],
  },
];

export const DESTINATIONS: Destination[] = [
  {
    slug: "prague",
    name: "פראג",
    tone: "burger",
    blurb: "עיר שקל מאוד לאכול בה רע. שלושה ימים, מקום אחד ששווה.",
    reviewSlugs: ["prague-knedliky"],
  },
  {
    slug: "london",
    name: "לונדון",
    tone: "coffee",
    blurb: "יקר, צפוף, ובסוף הארוחה הכי טובה שלי השנה.",
    reviewSlugs: ["london-salt-beef"],
  },
  {
    slug: "thailand",
    name: "תאילנד",
    tone: "green",
    blurb: "שבועיים, ועדיין רוב מה שאכלתי היה מדוכנים ברחוב.",
    reviewSlugs: ["bangkok-boat-noodle"],
  },
];
