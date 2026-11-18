/** Remounts on every page change inside a plugin's docs, so each page arrives with .page-in (globals.css). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
