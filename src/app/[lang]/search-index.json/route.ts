import { buildSearchIndex } from "@/lib/docs";
import { LANGS, toLang } from "@/content/registry";

/**
 * One search index per language, exported as a static JSON file.
 *
 * It used to be a prop of the nav, which serialised the whole index into every
 * exported page. As a file it is downloaded once, the first time search opens.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string }> }) {
  return Response.json(buildSearchIndex(toLang((await params).lang)));
}
