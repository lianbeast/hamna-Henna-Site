#!/usr/bin/env bash
# CSS contract check: every var() used must exist in tokens.css, and every
# non-utility class in the rendered page must have a rule in the built bundle.
# Scoped to components index.astro actually imports, so orphaned components
# (e.g. InstagramFeed.astro) don't fail the build.
set -uo pipefail
cd "$(dirname "$0")"

CSS=$(ls dist/_astro/*.css 2>/dev/null | head -1)
[ -f "$CSS" ] || { echo "FAIL: no built CSS - run pnpm build first"; exit 1; }

# Components reachable from the entry page, transitively via their own imports.
node <<'NODE' > /tmp/.sc_files
const fs = require("fs");
const seen = new Set();
const walk = (f) => {
  if (seen.has(f) || !fs.existsSync(f)) return;
  seen.add(f);
  const src = fs.readFileSync(f, "utf8");
  for (const m of src.matchAll(/from\s+['"][^'"]*\/([A-Za-z0-9_-]+)\.astro['"]/g))
    walk("src/components/" + m[1] + ".astro");
};
walk("src/pages/index.astro");
console.log([...seen].join("\n"));
NODE

bad=0

# 1. Every CSS custom property referenced must be defined in tokens.css.
grep -rhoE 'var\(--[a-z0-9-]+\)' $(cat /tmp/.sc_files) src/styles \
  | sed 's/var(\(.*\))/\1/' | sort -u > /tmp/.sc_used
grep -hoE '^\s*--[a-z0-9-]+' src/styles/tokens.css | tr -d ' ' | sort -u > /tmp/.sc_def
while read -r v; do
  grep -qx -- "$v" /tmp/.sc_def || { echo "FAIL: $v used but not defined in tokens.css"; bad=1; }
done < /tmp/.sc_used

# 2. Every non-utility class in reachable markup must have a rule.
grep -rhoE 'class="[^"]*"' $(cat /tmp/.sc_files) \
  | sed 's/class="//;s/"//' | tr ' ' '\n' | grep -v '^$' | sort -u > /tmp/.sc_cls
while read -r c; do
  case "$c" in
    bg-*|text-*|min-h-*|max-w-*|px-*|py-*|m[trblxy]*-*|gap-*|grid-*|flex*|items-*|\
justify-*|font-*|leading-*|tracking-*|rounded*|border*|shadow*|transition*|\
hover:*|focus:*|w-*|h-*|space-*|opacity*|relative|absolute|sticky|z-*|top-*|\
left-*|right-*|bottom-*|hidden|block|inline*|overflow*|whitespace*|underline|\
cursor*|pointer*|list-*|sr-*|col-*|row-*|order-*|ring*|outline*|fill|stroke|\
object-*|aspect*|backdrop*|blur*|from-*|to-*|via-*|group|peer|dark:*) continue ;;
  esac
  esc=$(printf '%s' "$c" | sed 's/[][\.*^$/]/\\&/g')
  grep -qE "[.]${esc}([^a-zA-Z0-9_-]|$)" "$CSS" \
    || { echo "FAIL: .$c has no rule in built CSS"; bad=1; }
done < /tmp/.sc_cls

[ $bad -eq 0 ] && echo "PASS: tokens + classes resolve" || exit 1
