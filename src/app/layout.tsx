import type { Metadata, Viewport } from "next";
import { Instrument_Serif } from "next/font/google";
import { AccentStyle, SERVICE_ACCENTS, ThemeProvider } from "@exylia-webs/ui";
import { rootViewport } from "@exylia-webs/ui/app";
import { rootFontVariables } from "@exylia-webs/ui/fonts";
import "./globals.css";
import { DEFAULT_LANG, SITE } from "@/content/registry";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });

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

export const viewport: Viewport = rootViewport;

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
    <html lang={DEFAULT_LANG} suppressHydrationWarning className={`${rootFontVariables} ${serif.variable}`}>
      <body className="font-sans antialiased">
        <AccentStyle color={SERVICE_ACCENTS.docs.fill} />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
