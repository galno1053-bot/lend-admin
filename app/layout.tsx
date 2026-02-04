import "./globals.css";
import type { Metadata } from "next";
import { League_Spartan, Manrope } from "next/font/google";
import Providers from "./providers";

const display = League_Spartan({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"]
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"]
});

export const metadata: Metadata = {
  title: "Naxa Finance - Admin",
  description: "Hybrid loan admin panel"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const allowlist = (process.env.ADMIN_ADDRESSES ?? "")
    .split(",")
    .map((addr) => addr.trim().toLowerCase())
    .filter(Boolean);

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen bg-admin-gradient">
        <Providers allowlist={allowlist}>{children}</Providers>
      </body>
    </html>
  );
}
