// The docs' stylesheet (Tailwind 3), loaded by the public pages only: the admin panel has its own.
import "./globals.css";
import { NotFoundBody } from "@/components/NotFoundBody";

/**
 * The 404, which cannot know its language.
 *
 * A static export serves one `404.html` for every unmatched path, including
 * paths with no language segment, so it reads in the fallback language and
 * its body picks the language from the path on the client.
 */
export default function NotFound() {
  return <NotFoundBody />;
}
