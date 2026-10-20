// Build-time prerender: renders each public page with the real React components
// and writes the result into its static HTML file, so search engines, AI crawlers
// and link previews that don't run JavaScript still see the full page and its
// structured data. The browser app replaces this markup as soon as it loads.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const ssrEntry = path.resolve(__dirname, '../dist-ssr/entry-server.js');

const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/services',
  '/work',
  '/blooming-in-pain',
  '/blooming-in-pain/submit',
  '/contact',
  '/accessibility',
];

// Head tags that react-helmet-async renders per page; the static copies in index.html are removed first.
const STATIC_HEAD_TAGS = [
  /\s*<title>[\s\S]*?<\/title>/gi,
  /\s*<meta\s+(?:name|property)="(?:description|author|keywords|og:[^"]*|twitter:[^"]*)"[^>]*>/gi,
  /\s*<link\s+rel="canonical"[^>]*>/gi,
];

const HEAD_TAG_IN_BODY = /<title[^>]*>[\s\S]*?<\/title>|<meta\s[^>]*>|<link\s+rel="canonical"[^>]*>|<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi;

const { render, loadSettings } = await import(pathToFileURL(ssrEntry).href);
const settings = await loadSettings();
console.log('Settings loaded (saved Supabase content where available, defaults otherwise)');

// Each page embeds only the settings it renders (shared layout + its own section), so the
// browser's first render matches the prerendered page without shipping every section everywhere.
const PAGE_SETTINGS = {
  '/': 'home',
  '/about': 'about',
  '/services': 'services',
  '/work': 'work',
  '/blooming-in-pain': 'bip',
  '/blooming-in-pain/submit': 'bip',
  '/contact': 'contact',
};
function settingsScriptFor(route) {
  const subset = { global: settings.global };
  const key = PAGE_SETTINGS[route];
  if (key) subset[key] = settings[key];
  // "<" escaped so saved text can never close the script tag
  return `<script>window.__SITE_SETTINGS__=${JSON.stringify(subset).replace(/</g, '\\u003c')}</script>`;
}
const baseHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
if (!baseHtml.includes('<div id="root"></div>')) {
  throw new Error('dist/index.html is not a fresh client build (root is not empty). Run "vite build" first.');
}

for (const route of PUBLIC_ROUTES) {
  const { html, helmet } = render(route);
  if (!html || html.length < 500) {
    throw new Error(`Prerender of ${route} produced almost no HTML (${html?.length ?? 0} chars)`);
  }

  // React 19 renders <title>, <meta>, <link> and JSON-LD where the component sits; in the browser
  // React moves them into <head>, so the static file does the same here.
  const headTags = [];
  const body = html.replace(HEAD_TAG_IN_BODY, (tag) => {
    headTags.push(tag);
    return '';
  });
  if (helmet) {
    for (const t of [helmet.title, helmet.meta, helmet.link, helmet.script]) {
      const str = t?.toString();
      if (str) headTags.push(str);
    }
  }
  if (!headTags.some((t) => t.startsWith('<title'))) throw new Error(`No <title> rendered for ${route}`);

  let page = baseHtml;
  for (const re of STATIC_HEAD_TAGS) page = page.replace(re, '');
  page = page.replace('</head>', `    ${headTags.join('\n    ')}\n    ${settingsScriptFor(route)}\n  </head>`);
  page = page.replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  const targets =
    route === '/'
      ? [path.join(distDir, 'index.html')]
      : [path.join(distDir, `${route.slice(1)}.html`), path.join(distDir, route.slice(1), 'index.html')];
  for (const file of targets) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, page);
  }
  console.log(`✓ Prerendered ${route} (${Math.round(html.length / 1024)} KB of content)`);
}
