"use client";

import { ErrorState } from "@exylia-webs/ui";

/** A query of an admin page failed: the design system's error state, with a fresh server render as retry. */
export default function AdminError({ retry }: { error: Error; retry: () => void }) {
  return <ErrorState bordered retry={retry} />;
}
