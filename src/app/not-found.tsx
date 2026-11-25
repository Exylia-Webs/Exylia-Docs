// The docs' stylesheet, loaded by the public pages only: the admin panel has its own.
import "./globals.css";
import { NotFoundByPath } from "@exylia-webs/ui";
import { uiMessages } from "@exylia-webs/ui/messages";
import { DEFAULT_LANG, LANGS } from "@/content/registry";

/**
 * The 404, which cannot know its language: a static export serves one `404.html` for every unmatched
 * path, so the library piece picks the language from the path on the client.
 */
export default function NotFound() {
  return <NotFoundByPath locales={LANGS} fallback={DEFAULT_LANG} messages={uiMessages} homeSuffix="/" />;
}
