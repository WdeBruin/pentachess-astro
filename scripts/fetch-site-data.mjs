import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import TurndownService from 'turndown';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const BASE_URL = 'https://www.pentachess.nl';

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return await res.text();
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/&#8230;/g, "…")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

async function main() {
  console.log('--- Step 2: Fetching Site Data & Assets ---');

  // Directories
  ensureDir(path.join(ROOT, 'public/css'));
  ensureDir(path.join(ROOT, 'public/js'));
  ensureDir(path.join(ROOT, 'public/assets/fonts/inter'));
  ensureDir(path.join(ROOT, 'public/wp-content/uploads'));
  ensureDir(path.join(ROOT, 'src/data'));
  ensureDir(path.join(ROOT, 'src/content/posts'));

  // 1. Download CSS, JS, and Fonts
  console.log('Downloading CSS, JS, and Fonts...');
  const filesToDownload = [
    { url: `${BASE_URL}/wp-includes/css/dist/block-library/style.min.css`, dest: 'public/css/block-library.css' },
    { url: `${BASE_URL}/wp-content/themes/twentytwenty/style.css`, dest: 'public/css/twentytwenty.css' },
    { url: `${BASE_URL}/wp-content/themes/twentytwenty/print.css`, dest: 'public/css/print.css' },
    { url: `${BASE_URL}/wp-content/themes/twentysixteen-child/style.css`, dest: 'public/css/child-style.css' },
    { url: `${BASE_URL}/wp-content/themes/twentytwenty/assets/js/index.js`, dest: 'public/js/twentytwenty-index.js' },
    { url: `${BASE_URL}/wp-content/themes/twentytwenty/assets/fonts/inter/Inter-upright-var.woff2`, dest: 'public/assets/fonts/inter/Inter-upright-var.woff2' },
    { url: `${BASE_URL}/wp-content/themes/twentytwenty/assets/fonts/inter/Inter-italic-var.woff2`, dest: 'public/assets/fonts/inter/Inter-italic-var.woff2' },
  ];

  for (const item of filesToDownload) {
    try {
      console.log(`Fetching ${item.url}...`);
      const buf = await fetchBuffer(item.url);
      ensureDir(path.dirname(path.join(ROOT, item.dest)));
      fs.writeFileSync(path.join(ROOT, item.dest), buf);
    } catch (e) {
      console.error(`Error fetching ${item.url}:`, e.message);
    }
  }

  // Also fetch homepage HTML to extract exact inline styles
  console.log('Fetching homepage HTML for inline styles extraction...');
  try {
    const homeHtml = await fetchText(BASE_URL);
    fs.writeFileSync(path.join(ROOT, 'src/data/raw-homepage.html'), homeHtml);

    // Extract inline styles
    const styles = {};
    const styleIds = ['global-styles-inline-css', 'twentytwenty-style-inline-css', 'custom-background-css', 'core-block-supports-inline-css'];
    for (const id of styleIds) {
      const match = homeHtml.match(new RegExp(`<style id=['"]${id}['"][^>]*>([\\s\\S]*?)<\\/style>`, 'i'));
      if (match) {
        styles[id] = match[1].trim();
      }
    }
    fs.writeFileSync(path.join(ROOT, 'src/data/inline-styles.json'), JSON.stringify(styles, null, 2));
    console.log(`Extracted ${Object.keys(styles).length} inline styles.`);
  } catch (e) {
    console.error('Error fetching homepage HTML:', e.message);
  }

  // 2. Fetch pages, posts, and users from WordPress REST API
  console.log('Fetching pages, posts, and users...');
  const [pagesRaw, postsRaw, usersRaw] = await Promise.all([
    fetchJson(`${BASE_URL}/wp-json/wp/v2/pages?per_page=100`),
    fetchJson(`${BASE_URL}/wp-json/wp/v2/posts?per_page=100`),
    fetchJson(`${BASE_URL}/wp-json/wp/v2/users?per_page=100`)
  ]);

  console.log(`Fetched ${pagesRaw.length} pages, ${postsRaw.length} posts, ${usersRaw.length} users.`);

  // Exclude page ID 441 (cancelled schoolschaakcongres page)
  const pages = pagesRaw.filter(p => p.id !== 441);

  // Map users: ID 5 mapped to Redactie (slug: redactie)
  const users = usersRaw.map(u => {
    if (u.id === 5) {
      return { ...u, name: 'Redactie', slug: 'redactie' };
    }
    return u;
  });
  fs.writeFileSync(path.join(ROOT, 'src/data/users.json'), JSON.stringify(users, null, 2));

  // Author mapping helper
  const authorMap = {
    1: { name: 'Wouter de Bruin', slug: 'admin' },
    2: { name: 'Marcel Klein', slug: 'mklein' },
    3: { name: 'Herbert Eppinga', slug: 'heppinga' },
    5: { name: 'Redactie', slug: 'redactie' },
  };

  // Fixed media assets
  const fixedMedia = [
    '/wp-content/uploads/2020/04/pentachess_logo.png',
    '/wp-content/uploads/2020/04/cropped-pentachess_logo-32x32.png',
    '/wp-content/uploads/2020/04/cropped-pentachess_logo-180x180.png',
    '/wp-content/uploads/2020/04/cropped-pentachess_logo-192x192.png',
    '/wp-content/uploads/2020/04/cropped-pentachess_logo-270x270.png',
    '/wp-content/uploads/2020/04/slide1.jpg',
    '/wp-content/uploads/2020/04/slide2.jpg',
    '/wp-content/uploads/2020/04/slide3.jpg',
    '/wp-content/uploads/2020/04/liamvrolijk.png',
    '/wp-content/uploads/2020/04/haast.png'
  ];

  // Collect all media URLs to download
  const mediaUrls = new Set(fixedMedia);

  // Find all uploads in pages and posts
  const findUploads = (content) => {
    if (!content) return;
    const regex = /(?:https?:)?\/\/(?:www\.pentachess\.nl|localhost\/pentachess)?(\/wp-content\/uploads\/[^\s"'<>)]+)/gi;
    let match;
    while ((match = regex.exec(content)) !== null) {
      let uploadPath = match[1];
      // strip any query params
      uploadPath = uploadPath.split('?')[0];
      mediaUrls.add(uploadPath);
    }
  };

  for (const page of pages) {
    findUploads(page.content?.rendered);
  }
  for (const post of postsRaw) {
    findUploads(post.content?.rendered);
  }

  console.log(`Found ${mediaUrls.size} unique media files to download.`);

  for (const relPath of mediaUrls) {
    const fullUrl = `${BASE_URL}${relPath}`;
    const localPath = path.join(ROOT, 'public', relPath.replace(/^\//, ''));
    if (!fs.existsSync(localPath)) {
      try {
        console.log(`Downloading media: ${relPath}...`);
        const buf = await fetchBuffer(fullUrl);
        ensureDir(path.dirname(localPath));
        fs.writeFileSync(localPath, buf);
      } catch (e) {
        console.warn(`Failed downloading ${fullUrl}: ${e.message}`);
      }
    }
  }

  // 3. Clean content
  function cleanHtml(html) {
    if (!html) return '';
    let res = html;

    // Fix localhost urls
    res = res.replace(/http:\/\/localhost\/pentachess\/wp-content\/uploads\//g, '/wp-content/uploads/');
    // Fix full urls
    res = res.replace(/(?:https?:)?\/\/www\.pentachess\.nl\/wp-content\/uploads\//g, '/wp-content/uploads/');
    // Fix blob img in post 381
    res = res.replace(/<img[^>]*src=["']blob:https?:\/\/[^"']*["'][^>]*>/gi, '');
    // Remove srcset and sizes
    res = res.replace(/\s+srcset="[^"]*"/gi, '');
    res = res.replace(/\s+srcset='[^']*'/gi, '');
    res = res.replace(/\s+sizes="[^"]*"/gi, '');
    res = res.replace(/\s+sizes='[^']*'/gi, '');

    // Internal post links:
    res = res.replace(/https?:\/\/www\.pentachess\.nl\/uncategorized\/([^/"']+)\/?/g, '/nieuws/$1/');
    res = res.replace(/https?:\/\/www\.pentachess\.nl\/nieuws\/([^/"']+)\/?/g, '/nieuws/$1/');

    return res;
  }

  // Process pages and save to src/data/pages.json
  const processedPages = {};
  for (const p of pages) {
    processedPages[p.slug] = {
      id: p.id,
      title: decodeHtmlEntities(p.title.rendered),
      content: cleanHtml(p.content.rendered),
      slug: p.slug
    };
  }
  fs.writeFileSync(path.join(ROOT, 'src/data/pages.json'), JSON.stringify(processedPages, null, 2));

  // 4. Convert Posts to Markdown
  const turndown = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
  });

  // Preserve tables and iframes as inline HTML in markdown
  turndown.keep(['table', 'thead', 'tbody', 'tr', 'th', 'td', 'iframe', 'figure', 'figcaption']);

  console.log(`Converting ${postsRaw.length} posts to Markdown...`);

  for (const post of postsRaw) {
    const id = post.id;
    const slug = post.slug;
    const title = decodeHtmlEntities(post.title.rendered);
    const date = post.date;
    const authorInfo = authorMap[post.author] || { name: 'Wouter de Bruin', slug: 'admin' };

    // Clean plain-text excerpt
    let excerpt = decodeHtmlEntities(post.excerpt?.rendered?.replace(/<[^>]+>/g, '').trim() || '');
    if (id === 425) {
      excerpt = `Let op: Dit evenement is uitgesteld. ${excerpt}`;
    }

    const cleanedContentHtml = cleanHtml(post.content.rendered);
    let mdContent = turndown.turndown(cleanedContentHtml);

    // Post 425 postponement notice
    if (id === 425) {
      mdContent = `> **Let op: Dit evenement (Schoolschaakcongres 28 oktober 2026) is uitgesteld naar een nader te bepalen datum.**\n\n${mdContent}`;
    }

    const frontmatter = [
      '---',
      `id: ${id}`,
      `title: ${JSON.stringify(title)}`,
      `date: ${date}`,
      `author: ${JSON.stringify(authorInfo.name)}`,
      `authorSlug: ${JSON.stringify(authorInfo.slug)}`,
      `excerpt: ${JSON.stringify(excerpt)}`,
      '---',
      '',
      mdContent,
      ''
    ].join('\n');

    fs.writeFileSync(path.join(ROOT, 'src/content/posts', `${slug}.md`), frontmatter, 'utf-8');
  }

  // 5. Create src/content/config.ts
  const contentConfig = `import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.number().optional(),
    title: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Wouter de Bruin'),
    authorSlug: z.string().default('admin'),
    excerpt: z.string().optional(),
  }),
});

export const collections = { posts };
`;
  fs.writeFileSync(path.join(ROOT, 'src/content/config.ts'), contentConfig, 'utf-8');

  console.log('--- Step 2 Completed Successfully ---');
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
