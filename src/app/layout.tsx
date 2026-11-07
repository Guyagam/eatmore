import type { Metadata, Viewport } from "next";
import { Assistant, Heebo, Karantina } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Intro from "@/components/layout/Intro";

/* Karantina is a Hebrew poster face — narrow, heavy, and it behaves exactly
   like the white type she lays over her photographs. Assistant carries the
   reading, Heebo carries the numbers. */
const karantina = Karantina({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "700"],
  variable: "--font-karantina",
  display: "swap",
});

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  variable: "--font-assistant",
  display: "swap",
});

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eatmore.example"),
  title: {
    default: "אוכלים עם מור — ביקורות מסעדות בארץ ובעולם",
    template: "%s · אוכלים עם מור",
  },
  description:
    "בודקת מסעדות בארץ ובעולם בשביל שאתם לא תלכו ותתאכזבו. ציון, מחיר, כשרות ופסק דין ברור לכל מקום.",
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "אוכלים עם מור",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#141010" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${karantina.variable} ${assistant.variable} ${heebo.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:inset-inline-start-4 focus:top-4 focus:z-[200] focus:rounded-sm focus:bg-ink focus:px-4 focus:py-3 focus:font-data focus:text-paper"
        >
          דילוג לתוכן
        </a>
        <Intro />
        <SmoothScroll />
        <Header />
        <main id="main" className="pt-[68px]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
