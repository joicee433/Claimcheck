import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Claimcheck",
  description: "Paste a claim and a link. Get a verdict from GenLayer validators.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable}>
      <body>
        <header className="border-b border-line">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Claimcheck
            </Link>
            <Link href="/new" className="text-sm font-medium text-accent underline underline-offset-4">
              Check a claim
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-5 py-10">{children}</main>
      </body>
    </html>
  );
}
