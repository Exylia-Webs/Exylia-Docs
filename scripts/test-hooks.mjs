// Lets `node --test` run the app's TypeScript as Next resolves it: `@/` is `src/`, imports have no
// extension, and the design system ships `.ts` under node_modules (Node will not strip types there
// by itself). Used as `node --import ./scripts/test-hooks.mjs --test …`.
import { existsSync, readFileSync, statSync } from "node:fs";
import { registerHooks, stripTypeScriptTypes } from "node:module";
import { fileURLToPath } from "node:url";

const SRC = new URL("../src/", import.meta.url);
const isFile = (url) => existsSync(url) && statSync(url).isFile();

registerHooks({
  resolve(specifier, context, next) {
    const local = specifier.startsWith("@/") ? new URL(specifier.slice(2), SRC) : specifier.startsWith(".") && context.parentURL?.startsWith("file:") ? new URL(specifier, context.parentURL) : null;
    if (local) {
      for (const suffix of ["", ".ts", ".tsx", "/index.ts"]) {
        const candidate = new URL(local.href + suffix);
        if (isFile(candidate)) return { url: candidate.href, format: candidate.pathname.endsWith(".ts") ? "module-typescript" : undefined, shortCircuit: true };
      }
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url.startsWith("file:") && url.includes("/node_modules/") && url.endsWith(".ts")) {
      return { format: "module", source: stripTypeScriptTypes(readFileSync(fileURLToPath(url), "utf8")), shortCircuit: true };
    }
    return next(url, context);
  },
});
