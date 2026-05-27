import type { Metadata } from "next";
import { Anton, Dancing_Script, Permanent_Marker, Inter } from "next/font/google";
import "./globals.css";

const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});
const script = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-script",
});
const brush = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-brush",
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Cosette Productions — Volunteers Wanted",
  description:
    "We're bringing art to life. Join us in painting a mural at Thee Herbal Blessing in Jackson, MS. All skill levels welcome.",
  openGraph: {
    title: "Cosette Productions — Volunteers Wanted",
    description:
      "Help paint a mural at Thee Herbal Blessing in Jackson, MS. All skill levels welcome.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${script.variable} ${brush.variable} ${body.variable}`}
    >
      <body className="font-body">{children}</body>
    </html>
  );
}
