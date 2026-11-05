import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CookieConsent } from "@exylia-webs/ui";
import { DEFAULT_LANG, SITE } from "@/content/registry";
import { MotionProvider } from "@/components/motion/MotionProvider";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — Minecraft plugin documentation`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description[DEFAULT_LANG],
  metadataBase: new URL(SITE.url),
  openGraph: {
    title: `${SITE.name} — Minecraft plugin documentation`,
    description: SITE.description[DEFAULT_LANG],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#050507",
  width: "device-width",
  initialScale: 1,
};

/**
 * The root document.
 *
 * `lang` is deliberately the fallback here and corrected per language by the
 * `[lang]` layout: a static export has one root document, and claiming Spanish
 * on an English page is worse for a screen reader than a fallback that the
 * inner layout immediately overrides.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={DEFAULT_LANG} suppressHydrationWarning className={`${geist.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <MotionProvider>{children}</MotionProvider>
        {/* The shared banner, restyled for the docs in globals.css (.consent). Its policy link is the hub's. */}
        <div className="consent">
          <CookieConsent gaId={process.env.NEXT_PUBLIC_GA_ID} clarityId={process.env.NEXT_PUBLIC_CLARITY_ID} />
        </div>
      </body>
    </html>
  );
}
