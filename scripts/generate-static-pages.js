import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run "vite build" first.');
  process.exit(1);
}

const baseHtmlPath = path.join(distDir, 'index.html');
if (!fs.existsSync(baseHtmlPath)) {
  console.error('Error: dist/index.html does not exist.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(baseHtmlPath, 'utf-8');

const routes = [
  {
    path: '/blooming-in-pain',
    title: 'Blooming in Pain — Centering Stories of Fibromyalgia & Chronic Pain | Pratik Aggarwal',
    description: 'Founded by Pratik Aggarwal in 2021 to create space for un-sanitised stories about living with fibromyalgia, chronic pain, and invisible conditions.',
    ogImage: 'https://pratik-aggarwal-website.vercel.app/blooming-in-pain-og.jpeg',
    canonical: 'https://pratik-aggarwal-website.vercel.app/blooming-in-pain',
  },
  {
    path: '/blooming-in-pain/submit',
    title: 'Share Your Story — Blooming in Pain | Pratik Aggarwal',
    description: 'Google Form submission page for Blooming in Pain. People living with invisible disabilities can share their honest accounts for publication on the platform.',
    ogImage: 'https://pratik-aggarwal-website.vercel.app/blooming-in-pain-og.jpeg',
    canonical: 'https://pratik-aggarwal-website.vercel.app/blooming-in-pain/submit',
  },
  {
    path: '/about',
    title: 'About Pratik Aggarwal — Disability Inclusion Expert & Storyteller | Pratik Aggarwal',
    description: '9+ years leading disability sensitization and accessibility advocacy across India. Co-founder of Blooming in Pain and former project lead at ASTHA.',
    ogImage: 'https://pratik-aggarwal-website.vercel.app/og-image.jpg',
    canonical: 'https://pratik-aggarwal-website.vercel.app/about',
  },
  {
    path: '/services',
    title: 'Services — Training, Institutional Advisory, Keynotes & Research | Pratik Aggarwal',
    description: 'Evidence-based disability inclusion services: Corporate Sensitization Workshops, Institutional DEI Advisory, Keynote Speaking, and Research Collaborations.',
    ogImage: 'https://pratik-aggarwal-website.vercel.app/og-image.jpg',
    canonical: 'https://pratik-aggarwal-website.vercel.app/services',
  },
  {
    path: '/work',
    title: 'Work & Engagements — Speaking, Advisory & Projects | Pratik Aggarwal',
    description: 'Past keynotes, workshops, institutional advisory engagements, and disability inclusion initiatives by Pratik Aggarwal.',
    ogImage: 'https://pratik-aggarwal-website.vercel.app/og-image.jpg',
    canonical: 'https://pratik-aggarwal-website.vercel.app/work',
  },
  {
    path: '/contact',
    title: 'Start a Partnership — Work With Pratik Aggarwal | Pratik Aggarwal',
    description: 'Contact page for Pratik Aggarwal — disability inclusion expert, speaker, and founder of Blooming in Pain.',
    ogImage: 'https://pratik-aggarwal-website.vercel.app/og-image.jpg',
    canonical: 'https://pratik-aggarwal-website.vercel.app/contact',
  },
  {
    path: '/accessibility',
    title: 'Accessibility Statement | Pratik Aggarwal',
    description: 'Accessibility statement and commitments for pratik-aggarwal-website.vercel.app.',
    ogImage: 'https://pratik-aggarwal-website.vercel.app/og-image.jpg',
    canonical: 'https://pratik-aggarwal-website.vercel.app/accessibility',
  },
];

console.log('Generating pre-rendered HTML for routes with dedicated meta & Open Graph tags...');

for (const route of routes) {
  let customHtml = baseHtml;

  // Replace title
  customHtml = customHtml.replace(/<title>.*?<\/title>/s, `<title>${route.title}</title>`);

  // Replace meta description
  customHtml = customHtml.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
    `<meta name="description" content="${route.description}" />`
  );

  // Replace canonical
  customHtml = customHtml.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
    `<link rel="canonical" href="${route.canonical}" />`
  );

  // Replace og:title
  customHtml = customHtml.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${route.title}" />`
  );

  // Replace og:description
  customHtml = customHtml.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:description" content="${route.description}" />`
  );

  // Replace og:url
  customHtml = customHtml.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:url" content="${route.canonical}" />`
  );

  // Replace og:image
  customHtml = customHtml.replace(
    /<meta\s+property="og:image"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:image" content="${route.ogImage}" />`
  );

  // Replace twitter:title
  customHtml = customHtml.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${route.title}" />`
  );

  // Replace twitter:description
  customHtml = customHtml.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${route.description}" />`
  );

  // Replace twitter:image
  customHtml = customHtml.replace(
    /<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:image" content="${route.ogImage}" />`
  );

  // Target directory: dist/route.path
  const targetDir = path.join(distDir, route.path.replace(/^\//, ''));
  fs.mkdirSync(targetDir, { recursive: true });

  const targetIndexPath = path.join(targetDir, 'index.html');
  fs.writeFileSync(targetIndexPath, customHtml, 'utf-8');

  // Also write dist/route.path.html for cleanUrls compatibility
  const targetCleanPath = path.join(distDir, `${route.path.replace(/^\//, '')}.html`);
  fs.writeFileSync(targetCleanPath, customHtml, 'utf-8');

  console.log(`✓ Generated static HTML for ${route.path} -> ${targetIndexPath} & ${targetCleanPath}`);
}

console.log('Static route meta generation complete!');
