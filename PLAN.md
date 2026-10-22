# Pentachess.nl — WordPress to Astro Migration Plan

This document provides a complete, step-by-step execution blueprint for cloning **www.pentachess.nl** from WordPress (Twenty Twenty + custom `twentysixteen-child` / `wp-penta` child theme) into a static **Astro** site with a 1:1 identical visual layout, typography, colors, slider, and content, while migrating all news posts to **Astro Content Collections (Markdown)**.

---

## 1. Site Audit & Architecture Summary

### Current Technology Stack (Source)
- **CMS:** WordPress 6.4.1 (`lang="nl-NL"`)
- **Parent Theme:** `twentytwenty` (`https://www.pentachess.nl/wp-content/themes/twentytwenty/style.css`)
- **Child Theme (`wp-penta`):** `https://www.pentachess.nl/wp-content/themes/twentysixteen-child/style.css`
  - Overrides menu font (`30px`, system sans-serif, `rgba(0,0,0,.5)`), darkgreen (`#006400` / `darkgreen`) headings & post titles, hides `.page > .entry-header`, hides `.footer-nav-widgets-wrapper`, `.entry-categories-inner`, and `footer`, removes top padding on `.post-inner`, and sets `.entry-content` max-width to `100rem`.
- **Slider Plugin (Home page only):** Smart Slider 3 (`1200x500` aspect ratio, full-width, horizontal slide animation, 8000ms autoplay, left/right SVG arrows, 3 images: `slide1.jpg`, `slide2.jpg`, `slide3.jpg`).

### Content & URL Architecture (Target in Astro)
- **4 Top-Level Routes (excluding cancelled `schoolschaakcongres-2026-basisscholen-aan-zet` page ID `441`):**
  1. `home` (ID `79`) -> `/` (Hero slider + dynamic "Laatste nieuws" top 3 posts from Content Collection + Aandachtsgebieden + Ambassadeurs + Partners en sponsors)
  2. `info` (ID `2`) -> `/info/` (Google Maps embed, contact info, Statutaire doelstelling, Hoofdlijnen beleid, RSIN, Beloningsbeleid, Bestuur samenstelling met 5 club-logo's)
  3. `nieuws` (ID `70`) -> `/nieuws/` (Paginated blog index, 10 full posts per page across 5 pages: `/nieuws/`, `/nieuws/page/2/` ... `/nieuws/page/5/`)
  4. `schoolschaak` (ID `172`) -> `/schoolschaak/` (YouTube embed, 3 manieren, lijst van schoolschaaktrainers)
  - *Note:* The page `schoolschaakcongres-2026-basisscholen-aan-zet` (ID `441`) is cancelled and MUST NOT be created or linked in the navigation menu.
- **50 News Posts (`src/content/posts/<slug>.md`):**
  - Stored as Markdown files in an **Astro Content Collection** (`src/content/posts/`).
  - **Unified URL Structure:** Every post URL is moved to `/nieuws/<slug>/` (replacing the old `/uncategorized/<slug>/` URLs).
  - **Postponement Notice on Post `425` (`aankondiging-schoolschaak-congres-woensdag-28-oktober-2026-driebergen-basisscholen-aan-zet`):**
    - Prepend a clear Dutch notice at the top of the post body (and reflect it in its excerpt):
      > **Let op: Dit evenement (Schoolschaakcongres 28 oktober 2026) is uitgesteld naar een nader te bepalen datum.**
  - **4 Authors:**
    - ID `1`: Wouter de Bruin (`admin`)
    - ID `2`: Marcel Klein (`mklein`)
    - ID `3`: Herbert Eppinga (`heppinga`)
    - ID `5`: Redactie (`redactie`) — *Note: Author ID `5` (formerly Meinte Smink, used on post `163`) MUST be mapped to `author: "Redactie"` and `authorSlug: "redactie"`. Do NOT include "Meinte Smink" or `msmink` as an author or author archive page anywhere on the site.*
- **Media Assets:**
  - Site Logo (`pentachess_logo.png`) + Favicons (`cropped-pentachess_logo-32x32.png`, `180x180`, `192x192`, `270x270`)
  - 3 Hero Slider images (`slide1.jpg`, `slide2.jpg`, `slide3.jpg`)
  - ~87 primary content images (`.jpg`, `.jpeg`, `.png`) referenced in pages and posts, downloaded locally to `public/wp-content/uploads/`.

---

## 2. Step-by-Step Execution Plan

Execute the following steps sequentially. Do not skip any step. Verify each step before moving to the next.

---

### Step 1: Initialize the Astro Project

1. Initialize a new Astro project in `C:\git\pentachess-astro` and install `turndown` (as a devDependency for converting WordPress post HTML to clean Markdown during the migration script).
2. Create `package.json` with `astro` and `turndown` (or run `npm init -y && npm install astro && npm install -D turndown`).
3. Configure `astro.config.mjs`:
   ```js
   import { defineConfig } from 'astro/config';

   export default defineConfig({
     site: 'https://www.pentachess.nl',
     trailingSlash: 'ignore',
     build: {
       format: 'directory'
     }
   });
   ```
4. Create the project directory structure:
   ```text
   C:\git\pentachess-astro\
   ├── public/
   │   ├── assets/
   │   │   └── fonts/
   │   ├── css/
   │   ├── js/
   │   └── wp-content/
   │       └── uploads/
   ├── scripts/
   ├── src/
   │   ├── components/
   │   ├── content/
   │   │   ├── config.ts
   │   │   └── posts/
   │   ├── data/
   │   ├── layouts/
   │   └── pages/
   ├── astro.config.mjs
   └── package.json
   ```

---

### Step 2: Scrape Stylesheets, Media Assets, and Convert Posts to Markdown Content Collection

Write and run a Node.js script `scripts/fetch-site-data.mjs` to download all assets and convert all 50 WordPress posts into Markdown files in `src/content/posts/`:

1. **Download Original CSS, Fonts & JS files into `public/`:**
   - `https://www.pentachess.nl/wp-includes/css/dist/block-library/style.min.css` -> `public/css/block-library.css`
   - `https://www.pentachess.nl/wp-content/themes/twentytwenty/style.css` -> `public/css/twentytwenty.css`
   - `https://www.pentachess.nl/wp-content/themes/twentytwenty/print.css` -> `public/css/print.css`
   - `https://www.pentachess.nl/wp-content/themes/twentysixteen-child/style.css` -> `public/css/child-style.css`
   - `https://www.pentachess.nl/wp-content/themes/twentytwenty/assets/js/index.js` -> `public/js/twentytwenty-index.js`
   - Download the Inter font files referenced in `twentytwenty.css`:
     - `https://www.pentachess.nl/wp-content/themes/twentytwenty/assets/fonts/inter/Inter-upright-var.woff2` -> `public/assets/fonts/inter/Inter-upright-var.woff2`
     - `https://www.pentachess.nl/wp-content/themes/twentytwenty/assets/fonts/inter/Inter-italic-var.woff2` -> `public/assets/fonts/inter/Inter-italic-var.woff2`

2. **Download All Media Assets (`public/wp-content/uploads/...`):**
   - Download fixed theme/slider images:
     - `/wp-content/uploads/2020/04/pentachess_logo.png`
     - `/wp-content/uploads/2020/04/cropped-pentachess_logo-32x32.png`
     - `/wp-content/uploads/2020/04/cropped-pentachess_logo-180x180.png`
     - `/wp-content/uploads/2020/04/cropped-pentachess_logo-192x192.png`
     - `/wp-content/uploads/2020/04/cropped-pentachess_logo-270x270.png`
     - `/wp-content/uploads/2020/04/slide1.jpg`
     - `/wp-content/uploads/2020/04/slide2.jpg`
     - `/wp-content/uploads/2020/04/slide3.jpg`
   - Fetch pages (`/wp-json/wp/v2/pages?per_page=100`, excluding page ID `441`), posts (`/wp-json/wp/v2/posts?per_page=100`), and users (`/wp-json/wp/v2/users?per_page=100`).
   - Extract all image/media URLs from `content.rendered` across pages and posts matching:
     - `https://www.pentachess.nl/wp-content/uploads/...`
     - `http://www.pentachess.nl/wp-content/uploads/...`
     - `//www.pentachess.nl/wp-content/uploads/...`
     - `http://localhost/pentachess/wp-content/uploads/...`
   - Download each unique file from `https://www.pentachess.nl/wp-content/uploads/...` into `public/wp-content/uploads/<year>/<month>/<filename>`.

3. **Clean & Fix Content URLs:**
   - Fix the broken `http://localhost/pentachess/wp-content/uploads/...` image URLs on the `home` page (`liamvrolijk.png` and `haast.png`) so they point to `/wp-content/uploads/2020/04/liamvrolijk.png` and `/wp-content/uploads/2020/04/haast.png`.
   - Remove the broken `blob:https://www.pentachess.nl/...` `<img>` tag in post `381` (`werelds-wint-vijfheerenlanden-schoolschaak-toernooi-van-2025`).
   - Rewrite all `https://www.pentachess.nl/wp-content/uploads/...` URLs to `/wp-content/uploads/...` and remove `srcset`/`sizes` attributes so images load cleanly from the local paths.
   - Rewrite any internal post links (`https://www.pentachess.nl/uncategorized/<slug>/` or `https://www.pentachess.nl/nieuws/<slug>/`) to `/nieuws/<slug>/`.
   - Save the cleaned static pages (`home`, `info`, `schoolschaak`) to `src/data/pages.json` and authors (with ID `5` mapped to `name: "Redactie"`, `slug: "redactie"`) to `src/data/users.json`.

4. **Convert All 50 News Posts to Markdown (`src/content/posts/<slug>.md`):**
   - For each of the 50 posts from `/wp-json/wp/v2/posts?per_page=100`:
     - Decode HTML entities in `title.rendered` (e.g. `&#8220;` -> `"`, `&#038;` -> `&`, `&#8211;` -> `–`).
     - Map `author` ID to author name and slug:
       - `1` -> `author: "Wouter de Bruin"`, `authorSlug: "admin"`
       - `2` -> `author: "Marcel Klein"`, `authorSlug: "mklein"`
       - `3` -> `author: "Herbert Eppinga"`, `authorSlug: "heppinga"`
       - `5` -> `author: "Redactie"`, `authorSlug: "redactie"` (replaces Meinte Smink)
     - Extract a clean plain-text `excerpt` from `excerpt.rendered` (for the homepage "Laatste nieuws" section).
     - Convert `content.rendered` HTML to clean Markdown using `turndown` (preserving tables, links, lists, headings, and images, or keeping `<table>`/`<iframe>` HTML blocks inline where Markdown doesn't natively support complex attributes).
     - **Special Rule for Post `425` (`aankondiging-schoolschaak-congres-woensdag-28-oktober-2026-driebergen-basisscholen-aan-zet`):**
       - Prepend the postponement notice at the very top of its Markdown content:
         ```markdown
         > **Let op: Dit evenement (Schoolschaakcongres 28 oktober 2026) is uitgesteld naar een nader te bepalen datum.**
         ```
       - Also prepend `"Let op: Dit evenement is uitgesteld. "` to its `excerpt` frontmatter so visitors immediately see it on the homepage's "Laatste nieuws" list as well.
     - Write each post to `src/content/posts/<slug>.md` with frontmatter:
       ```yaml
       ---
       id: 436
       title: "ONJK Snelschaak 25 oktober Gorinchem"
       date: 2026-09-04T19:08:49
       author: "Wouter de Bruin"
       authorSlug: "admin"
       excerpt: "Pentachess organiseert dit jaar het ONJK Snelschaak in Gorinchem..."
       ---
       ```

5. **Define the Content Collection Schema (`src/content/config.ts`):**
   ```ts
   import { defineCollection, z } from 'astro:content';

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
   ```

6. **Verification:**
   - Confirm `src/content/posts/` contains 50 `.md` files.
   - Confirm `src/content/posts/aankondiging-schoolschaak-congres-woensdag-28-oktober-2026-driebergen-basisscholen-aan-zet.md` starts with the Dutch postponement notice.
   - Confirm all downloaded images in `public/wp-content/uploads/` exist and are non-empty.

---

### Step 3: Build the Base Layout, Header, and Mobile Navigation Modal

Create `src/layouts/BaseLayout.astro` and `src/components/Header.astro` to replicate the exact WordPress Twenty Twenty + Child Theme DOM and styling.

1. **`src/layouts/BaseLayout.astro`:**
   - Props: `title`, `bodyClass`.
   - `<html class="js" lang="nl-NL">`
   - Include `<head>` with:
     - `<meta charset="UTF-8">`
     - `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
     - `<title>{title}</title>`
     - Links to `/css/block-library.css`, `/css/twentytwenty.css`, `/css/child-style.css`, `/css/print.css`.
     - Exact inline `<style id="global-styles-inline-css">`, `<style id="twentytwenty-style-inline-css">`, `<style id="custom-background-css">`, and `<style id="core-block-supports-inline-css">` copied from `pentachess.nl` so CSS variables, flex-wrap rules on `.wp-block-columns`, and accent colors (`#e22658`, `#e21249`, `#f8f9fa`, `darkgreen`) match 100%.
     - Favicon links pointing to `/wp-content/uploads/2020/04/cropped-pentachess_logo-*.png`.
     - `<script src="/js/twentytwenty-index.js" async></script>` (handles mobile menu modal toggle & accessibility out-of-the-box).
   - Render skip link: `<a class="skip-link screen-reader-text" href="#site-content">Overslaan naar de inhoud</a>`
   - Render `<Header currentPath={Astro.url.pathname} />`
   - Render `<main id="site-content" role="main"><slot /></main>`

2. **`src/components/Header.astro`:**
   - Replicate `<header id="site-header" class="header-footer-group" role="banner">` and `<div class="menu-modal cover-modal header-footer-group" data-modal-target-string=".menu-modal">` with the exact SVG icons and classes.
   - Logo:
     ```html
     <div class="site-logo faux-heading">
       <a href="/" class="custom-logo-link" rel="home">
         <img width="2953" height="1713" src="/wp-content/uploads/2020/04/pentachess_logo.png" class="custom-logo" alt="Pentachess" decoding="async" fetchpriority="high" />
       </a>
       <span class="screen-reader-text">Pentachess</span>
     </div>
     ```
   - Navigation Menu items (highlight active item with `current-menu-item current_page_item`; contains only these 4 items, omitting the cancelled Schoolschaakcongres page):
     1. `Home` -> `/`
     2. `Info` -> `/info/`
     3. `Nieuws` -> `/nieuws/`
     4. `Schoolschaak` -> `/schoolschaak/`

---

### Step 4: Build the Homepage Hero Slider Component (`src/components/HeroSlider.astro`)

On the homepage (`/`), Pentachess uses Smart Slider 3 right at the top of `.entry-content`. Build a lightweight, self-contained `HeroSlider.astro` component that looks and behaves identically:

1. **Visual & Layout Specs (matching Smart Slider 3 config):**
   - Full-bleed width (`100vw`, breaking out of `.post-inner.thin` via `margin-left: calc(50% - 50vw); width: 100vw;` just like `<ss3-force-full-width>`).
   - Aspect Ratio: `1200 / 500` (`aspect-ratio: 1200 / 500; max-width: 3000px; width: 100%; position: relative; overflow: hidden;`).
   - Slides:
     - `/wp-content/uploads/2020/04/slide1.jpg`
     - `/wp-content/uploads/2020/04/slide2.jpg`
     - `/wp-content/uploads/2020/04/slide3.jpg`
   - Images cover the slide area (`width: 100%; height: 100%; object-fit: cover; object-position: 50% 50%;`).
   - Transition: Horizontal sliding track (`display: flex; transition: transform 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94);` matching `easeOutQuad` 800ms).
   - Controls:
     - Left & Right arrows positioned vertically centered, `15px` from left/right edges, using the exact inline SVG arrows from the original site (`width="32" height="32"`, white `#ffffff` with `0.8` opacity, hidden on mobile screens `< 700px` portrait / `< 900px` landscape).
     - Autoplay every `8000ms` (looping), plus keyboard arrow support and touch swipe support.

---

### Step 5: Implement the 3 Static Content Pages (`Home`, `Info`, `Schoolschaak`)

1. **Homepage (`src/pages/index.astro`):**
   - Uses `BaseLayout` with `title="Pentachess"` and `bodyClass="home page-template-default page page-id-79 custom-background wp-custom-logo wp-embed-responsive singular missing-post-thumbnail has-no-pagination not-showing-comments show-avatars footer-top-visible"`.
   - Fetches all posts from `getCollection('posts')`, sorts descending by `data.date`, and takes the **first 3 posts**.
   - Inside `<article class="post-79 page type-page status-publish hentry" id="post-79">` -> `<div class="post-inner thin">` -> `<div class="entry-content">`:
     1. Render `<HeroSlider />`.
     2. Render `<h3 class="has-text-align-left has-text-color wp-block-heading" style="color:#006400">Laatste nieuws</h3>`.
     3. Dynamically render `<ul class="wp-block-latest-posts__list has-dates alignfull wp-block-latest-posts">` using the top 3 posts:
        - Post title link (`class="wp-block-latest-posts__post-title"`, `href={`/nieuws/${post.slug}/`}`)
        - Post date in Dutch format (`<time class="wp-block-latest-posts__post-date">4 september 2026</time>`)
        - Post excerpt (`<div class="wp-block-latest-posts__post-excerpt">...</div>`) with "Lees meer" link to `/nieuws/${post.slug}/` if truncated.
     4. Render the remaining sections of the Home page (`Aandachtsgebieden`, `Ambassadeurs`, `Partners en sponsors`) with local `/wp-content/uploads/...` image paths (including the fixed `liamvrolijk.png` and `haast.png` paths).

2. **Info Page (`src/pages/info.astro`):**
   - Route: `/info/`
   - Title: `Info – Pentachess`
   - Renders the exact content of page ID `2` inside `<article class="post-2 page type-page status-publish hentry" id="post-2">`, including the Google Maps `<iframe>`, policy lists, RSIN, and the 5 board members with their chess club logos.

3. **Schoolschaak Page (`src/pages/schoolschaak.astro`):**
   - Route: `/schoolschaak/`
   - Title: `Schoolschaak – Pentachess`
   - Renders the exact content of page ID `172`, including the responsive 16:9 YouTube `<iframe>` embed (`https://www.youtube.com/embed/oaEyEfAZUNQ?feature=oembed`).
   - Ensure CSS rule for `.wp-embed-aspect-16-9 .wp-block-embed__wrapper` provides a responsive 16:9 video container (`position: relative; padding-bottom: 56.25%; height: 0;` with `iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }`).

---

### Step 6: Implement the Nieuws Index, Pagination, and Post Routes (`/nieuws/...`)

1. **Create a Reusable Post Article Component (`src/components/PostArticle.astro`):**
   - Props: `post` (entry from `posts` collection), `isSingle` (boolean), `prevPost`, `nextPost`.
   - Calls `const { Content } = await post.render();` to render the Markdown content.
   - Renders `<article class="post type-post status-publish format-standard hentry">`:
     - `<header class="entry-header has-text-align-center">`
     - Title:
       - If `isSingle`: `<h1 class="entry-title">{post.data.title}</h1>`
       - If index (`!isSingle`): `<h2 class="entry-title heading-size-1"><a href={`/nieuws/${post.slug}/`}>{post.data.title}</a></h2>`
     - Post Meta (`<ul class="post-meta">`):
       - Author icon SVG + `Door <a href={`/author/${post.data.authorSlug}/`}>{post.data.author}</a>`
       - Calendar icon SVG + `<a href={`/nieuws/${post.slug}/`}>{formattedDutchDate}</a>` (e.g. `4 september 2026`, formatted using `Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })`)
     - `<div class="post-inner thin"><div class="entry-content"><Content /></div></div>`
     - If `isSingle`, render `<nav class="pagination-single section-inner ...">` with links to `prevPost` (`/nieuws/${prevPost.slug}/`, left arrow `&larr;`) and `nextPost` (`/nieuws/${nextPost.slug}/`, right arrow `&rarr;`).

2. **Create the Nieuws Pagination Pages (`10` posts per page):**
   - `src/pages/nieuws/index.astro` -> queries `getCollection('posts')` sorted newest-first, renders Page 1 (posts `0..9` separated by `<hr class="post-separator styled-separator is-style-wide section-inner" aria-hidden="true" />`), and renders the pagination bar (`1`, `2`, `…`, `5`, `Oudere berichten →`).
   - `src/pages/nieuws/page/[page].astro` -> uses `getStaticPaths()` to generate pages `2..N` (10 posts per page) with matching Twenty Twenty pagination markup (`← Nieuwere berichten`, page numbers, `Oudere berichten →`).

3. **Create Individual Post Routes (`src/pages/nieuws/[slug].astro`):**
   - All news posts live at `/nieuws/<slug>/`.
   - Use `getStaticPaths()` in `src/pages/nieuws/[slug].astro` iterating over all sorted entries from `getCollection('posts')`.
   - Pass each `post` along with `prevPost` (older post) and `nextPost` (newer post) to `<PostArticle post={post} isSingle={true} prevPost={prevPost} nextPost={nextPost} />`.

4. **Author Archive Routes (`src/pages/author/[author].astro`):**
   - Generate `/author/<authorSlug>/` pages (for `admin`, `heppinga`, `mklein`, `redactie`) so clicking an author name in the post meta displays their posts cleanly.

---

### Step 7: Build & Visual Verification

1. Run `npm run build` and verify that all pages, paginated news routes (`/nieuws/`, `/nieuws/page/2/`..`5/`), and all 50 individual post routes (`/nieuws/<slug>/`) build cleanly into `dist/` without errors.
2. Start the preview server (`npm run preview`) and verify:
   - **Homepage (`/`):** Logo, 4 navigation links (`Home`, `Info`, `Nieuws`, `Schoolschaak` in 30px gray font), full-width Hero Slider with 3 slides & arrows, "Laatste nieuws" with top 3 posts in darkgreen linking to `/nieuws/<slug>/`, 3-column "Aandachtsgebieden", 2-column "Ambassadeurs" (with working photos for Liam Vrolijk and Anne Haast), "Partners en sponsors".
   - **Info (`/info/`):** Google Maps iframe, darkgreen headings, 5 chess club logos + board member bios in columns.
   - **Nieuws (`/nieuws/` & `/nieuws/page/2/`):** Full post rendering from Markdown, darkgreen titles, author & Dutch date meta with SVG icons, styled separators, pagination links, and the Dutch postponement notice at the top of the Schoolschaakcongres announcement post.
   - **Schoolschaak (`/schoolschaak/`):** Embedded YouTube video with 16:9 aspect ratio, text & trainers list.
   - **Single Post (`/nieuws/onjk-snelschaak-25-oktober-gorinchem/`):** Title, meta, content, images, and previous/next post navigation.
   - **Mobile Viewport (`< 1000px`):** "Menu" button opens the slide-in mobile navigation modal and "Menu sluiten" closes it.
