// Database pagination for the /admin lists: 1-based `?page=`, 50 rows. Paths end in a slash (trailingSlash).
export const PAGE_SIZE = 50;

/** `?page=` as a 1-based page; anything else is page 1. */
export function parsePage(raw: string | undefined): number {
  const page = Number(raw);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

/** `path` at `page`; page 1 is left out. */
export const pageHref = (path: string, page: number) => (page > 1 ? `${path}?page=${page}` : path);
