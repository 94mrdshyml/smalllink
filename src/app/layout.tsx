import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { TopBar } from "@/components/top-bar";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "smalllink", template: "%s · smalllink" },
  description: "Short links with your own slug, and a count of every click.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f2f4f7",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans">
        {/* Phone-width column on every screen, centred on larger ones */}
        <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col border-x border-border bg-ground">
          <TopBar />
          {children}
        </div>
      </body>
    </html>
  );
}
