// The cells the admin lists share, so an admin and a time read the same in each table.
import { Avatar, RelativeTime } from "@exylia-webs/ui";

/** "3 h ago" with the exact date on hover, or `never` when there is no date. */
export function Ago({ date, never }: { date: Date | number | null | undefined; never: string }) {
  return date === null || date === undefined ? <span className="text-ink-4">{never}</span> : <RelativeTime date={date} />;
}

/** An admin: their avatar (initials when none) and name at the time. */
export function PersonCell({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <Avatar src={avatarUrl} name={name} size="sm" />
      <span className="truncate font-medium text-ink">{name}</span>
    </span>
  );
}
