import { SettingsSkeleton } from "@exylia-webs/ui";

/** Shaped like the settings page, so switching pages never leaves the previous one standing still. */
export default function Loading() {
  return <SettingsSkeleton rows={5} />;
}
