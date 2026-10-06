import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { DEFAULT_LANG, SITE } from "@/content/registry";
import { MotionProvider } from "@/components/motion/MotionProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

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
  icons: { icon: "/exylia-mark.webp" },
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
    <html lang={DEFAULT_LANG} className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
