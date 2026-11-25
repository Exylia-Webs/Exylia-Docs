import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { TooltipProvider } from "@exylia-webs/ui";
import { HtmlLang } from "@/components/HtmlLang";
import { adminText } from "@/lib/admin-i18n";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Everything under /admin: the design system's providers (the root layout loads its stylesheet and theme). Who may see a page is checked by the panel's layout, each page and each action.
 */
export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const { lang } = await adminText();
  return (
    <NextIntlClientProvider>
      <HtmlLang lang={lang} />
      <TooltipProvider>{children}</TooltipProvider>
    </NextIntlClientProvider>
  );
}
