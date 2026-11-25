"use client";

import { useLayoutEffect, useRef } from "react";
import { useTheme } from "@exylia-webs/ui";

// The home's 3D kit (.xs, Stage) reads data-xs-theme on its wrapper; the site has one theme
// (ThemeProvider, class on <html>). This mirrors the one onto the other: inline before paint,
// then on every change.
const first = `(function(){var e=document.currentScript.parentElement;e.setAttribute("data-xs-theme",document.documentElement.classList.contains("dark")?"dark":"light")})()`;

export function XsThemeBridge() {
  const ref = useRef<HTMLScriptElement>(null);
  const { resolvedTheme } = useTheme();
  useLayoutEffect(() => {
    if (resolvedTheme) ref.current?.parentElement?.setAttribute("data-xs-theme", resolvedTheme === "dark" ? "dark" : "light");
  }, [resolvedTheme]);
  // biome-ignore lint/security/noDangerouslySetInnerHtml: a constant string of ours.
  return <script ref={ref} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: first }} />;
}
