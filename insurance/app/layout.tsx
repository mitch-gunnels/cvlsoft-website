import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { BRAND } from "@/lib/config";
import { Header } from "@/components/Header";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: `${BRAND.name} — ${BRAND.tagline}`, template: `%s · ${BRAND.name}` },
  description: BRAND.tagline,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border mt-20 bg-surface">
          <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-muted flex flex-col sm:flex-row gap-2 justify-between">
            <span>© {BRAND.name} — a CVL Software demo. {BRAND.supportPhone}</span>
            <a className="hover:text-foreground" href="/api/openapi">API spec</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
