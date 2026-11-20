"use client";

import type { ReactNode } from "react";
import { AuthFrame, SERVICE_ACCENTS, Stage } from "@exylia-webs/ui/site";
import { xsFonts } from "./fonts";
import { FRAG, SHOTS } from "./shader";

/** The admin sign-in on the reading-room set: the stack of closed books behind the card. */
export function DocsAuthFrame({ lines, lead, children }: { lines: string[]; lead: string; children: ReactNode }) {
  return (
    <AuthFrame
      fonts={xsFonts}
      product="Docs"
      lines={lines}
      lead={lead}
      accent={SERVICE_ACCENTS.docs}
      stage={(reduced) => <Stage frag={FRAG} spots={10} reduced={reduced} pin={4} lite shots={SHOTS} poster="/scene/auth" />}
    >
      {children}
    </AuthFrame>
  );
}
