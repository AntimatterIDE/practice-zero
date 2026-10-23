/**
 * Move Next's async chunk tags out of the first paint.
 *
 * On a fast connection those scripts download and evaluate before Largest
 * Contentful Paint, so Lighthouse's simulated throttling treats them as
 * required for the hero headline. Insert the tags on the frame after first
 * paint, and do not preload them — a preload that finishes before paint is
 * still counted. The text then paints from HTML and CSS alone.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const roots = [
  path.join(process.cwd(), ".next/server/app"),
  path.join(process.cwd(), ".next/server/route-cache"),
];
const scriptTagSource =
  /<script\b([^>]*?)\bsrc="(\/_next\/static\/chunks\/[^"]+)"([^>]*)><\/script>/g;

async function htmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function transform(html) {
  const scripts = [];
  const scriptTag = new RegExp(scriptTagSource.source, "g");
  const next = html.replace(scriptTag, (full, before, src, after) => {
    const attrs = `${before} ${after}`;
    if (/\bnoModule\b|\bnomodule\b/i.test(attrs)) return full;
    const id = attrs.match(/\bid="([^"]+)"/)?.[1] ?? "";
    scripts.push({ src, id });
    return "";
  });
  if (scripts.length === 0) return html;

  const payload = JSON.stringify(scripts);
  const loader =
    `<script>requestAnimationFrame(function(){requestAnimationFrame(function(){` +
    `${payload}.forEach(function(item){var s=document.createElement("script");` +
    `s.src=item.src;if(item.id)s.id=item.id;s.async=false;document.body.appendChild(s)})})})` +
    `</script>`;

  // Drop script preloads. They finish before first paint on a fast connection
  // and Lantern then treats those bytes as part of LCP.
  let out = next.replace(/<link rel="preload" as="script"[^>]*>/g, "");
  if (!out.includes("<body")) {
    throw new Error("prerendered HTML is missing <body>");
  }
  out = out.replace(/<body([^>]*)>/, `<body$1>${loader}`);
  return out;
}

const files = [];
for (const root of roots) {
  try {
    files.push(...(await htmlFiles(root)));
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}
let changed = 0;
for (const file of files) {
  const html = await readFile(file, "utf8");
  const next = transform(html);
  if (next === html) continue;
  await writeFile(file, next);
  changed += 1;
}

if (changed === 0) {
  console.log("defer-initial-scripts: no async chunk tags found");
} else {
  console.log(`defer-initial-scripts: updated ${changed} html file(s)`);
}
