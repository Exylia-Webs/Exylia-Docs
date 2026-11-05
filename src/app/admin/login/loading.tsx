import { Skeleton } from "@exylia-webs/ui";

/** The login card's shape while the session is checked. */
export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[400px] space-y-4 px-4 py-24" aria-busy>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-9 w-3/4" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
