import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/config";
import { Header } from "@/components/Header";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: { default: `${BRAND.name} — ${BRAND.tagline}`, template: `%s · ${BRAND.name}` },
  description: BRAND.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border mt-24">
          <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted flex flex-col sm:flex-row gap-2 justify-between">
            <span>
              © {BRAND.legalName} · {BRAND.location} — a CVL Software demo store.
            </span>
            <span className="flex gap-4">
              <a className="hover:text-foreground" href="/api/openapi">
                API spec
              </a>
              <span>Demo store — no real payments</span>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
