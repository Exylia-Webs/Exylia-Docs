import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider, TooltipProvider } from "@exylia-webs/ui";
import { HtmlLang } from "@/components/HtmlLang";
import { adminText } from "@/lib/admin-i18n";
import "./admin.css";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Everything under /admin: the design system's providers and stylesheet, which the public docs
 * never load. Who may see a page is checked by the panel's layout, each page and each action.
 */
export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const { lang } = await adminText();
  return (
    <NextIntlClientProvider>
      <HtmlLang lang={lang} />
      <ThemeProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
