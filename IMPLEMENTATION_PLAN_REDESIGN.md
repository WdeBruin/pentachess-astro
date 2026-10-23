# Pentachess.nl — Complete Visual Redesign Implementation Plan

> **Target Executor:** Fast Coding Agent (Flash Agent)  
> **Objective:** Execute a complete, brand-aligned visual redesign of **pentachess.nl** in Astro 4 while preserving all existing routes, Markdown Content Collections (`50` news posts), static pages, media assets, and business logic.  
> **Execution Rule:** Complete each task sequentially in order (`Phase 0` through `Phase 6`), checking off `- [x]` items as you go. Every file path, CSS rule, prop interface, and markup structure is explicitly provided below—do not guess or improvise.

---

## Project Context Summary

### 1. Detected Tech Stack & Configuration
- **Framework:** Astro `^4.16.18` (`type: "module"`, static output `build.format: 'directory'`, `trailingSlash: 'ignore'`).
- **Styling Solution:** Standard CSS + Astro scoped `<style>` blocks (no Tailwind installed).
  - **Legacy CSS Conflict Warning:** `src/layouts/BaseLayout.astro` currently loads WordPress TwentyTwenty stylesheets (`/css/twentytwenty.css`, `/css/child-style.css`, and `src/data/inline-styles.json`). Specifically, `twentytwenty.css` sets `html { font-size: 62.5% }` (which breaks standard `1rem = 16px` sizing) and `child-style.css` sets `footer { display: none; }` (which hides any `<footer>` element).
  - **Migration Strategy:** In **Phase 1**, we will introduce a clean design-system stylesheet at `public/css/redesign.css` and remove `/css/twentytwenty.css`, `/css/child-style.css`, `/js/twentytwenty-index.js`, and `inline-styles.json` from `BaseLayout.astro`, while keeping `/css/block-library.css` so Gutenberg HTML inside blog posts (`src/content/posts/*.md`) continues to render tables, figures, and columns cleanly.

### 2. Current Directory & Routing Structure
```text
C:\git\pentachess-astro\
├── public/
│   ├── css/
│   │   ├── block-library.css       # Keep for WP Gutenberg blocks in Markdown posts
│   │   ├── twentytwenty.css        # Legacy WP theme (disconnect from BaseLayout)
│   │   ├── child-style.css         # Legacy WP child theme (disconnect from BaseLayout)
│   │   ├── print.css               # Keep for print media
│   │   └── redesign.css            # [NEW] Global Design System tokens & utilities
│   ├── images/
│   │   └── redesign/               # [NEW] Cropped hero illustrations & SVG fallbacks
│   └── wp-content/
│       └── uploads/                # Existing migrated media (logo, ambassadors, post images)
├── redesign/                       # UX Reference Mockups & Source Illustration Sheet
│   ├── Gemini_Generated_Image_7xm7m87xm7m87xm7.jpg  # Homepage & Mobile Mockup (2752x1536)
│   ├── Gemini_Generated_Image_idik9jidik9jidik.jpg  # Header Illustrations Sheet (2400x1792)
│   └── Gemini_Generated_Image_ymo3tvymo3tvymo3.jpg  # Toernooien, Schoolschaak & Components (2752x1536)
├── src/
│   ├── components/
│   │   ├── Header.astro            # [UPDATE] Sticky white navbar + mobile drawer
│   │   ├── Footer.astro            # [NEW] Clean site footer with links & contact info
│   │   ├── HeroSection.astro       # [NEW] Reusable 2-col Blue-to-Green wave hero
│   │   ├── Button.astro            # [NEW] Reusable pill button component
│   │   ├── FocusAreaCard.astro     # [NEW] "Aandachtsgebieden" card with SVG icon header
│   │   ├── NewsCard.astro          # [NEW] "Laatste Nieuws" card with thumbnail extraction
│   │   ├── AmbassadorCards.astro   # [NEW] Profile cards for Liam Vrolijk & Anne Haast
│   │   ├── Pagination.astro        # [UPDATE] Pill-styled pagination controls
│   │   └── PostArticle.astro       # [UPDATE] Modernized news article card/view
│   ├── content/
│   │   ├── config.ts               # Astro Content Collection schema for 'posts' (50 .md files)
│   │   └── posts/                  # 50 migrated news posts (DO NOT delete or rename)
│   ├── data/
│   │   ├── pages.json              # Raw HTML for legacy pages
│   │   └── tournaments.ts          # [NEW] Structured calendar & viertallen standings data
│   ├── layouts/
│   │   └── BaseLayout.astro        # [UPDATE] Loads Nunito font, redesign.css, Header & Footer
│   └── pages/
│       ├── index.astro             # [UPDATE] Redesigned Homepage (/)
│       ├── toernooien.astro        # [NEW] Redesigned Toernooien page (/toernooien/)
│       ├── schoolschaak.astro      # [UPDATE] Redesigned Schoolschaak page (/schoolschaak/)
│       ├── schaakles.astro         # [NEW] Dedicated Schaakles page (/schaakles/)
│       ├── info.astro              # [UPDATE] Over Ons / Info page (/info/)
│       ├── author/
│       │   └── [author].astro      # [UPDATE] Author archive page
│       └── nieuws/
│           ├── index.astro         # [UPDATE] Redesigned Nieuws overview (/nieuws/)
│           ├── [slug].astro        # [UPDATE] Single post view (/nieuws/[slug]/)
│           └── page/
│               └── [page].astro    # [UPDATE] Paginated Nieuws view (/nieuws/page/[page]/)
```

---

## Phase 0: Asset Preparation & Placeholders

The source illustration sheet `redesign/Gemini_Generated_Image_idik9jidik9jidik.jpg` (`2400 x 1792` px) contains all three page hero illustrations (`Header 1: Homepage`, `Header 2: Jeugdtoernooien`, `Header 3: Schoolschaak`).

- [x] **Task 0.1: Create `public/images/redesign/` and crop the 3 Hero Illustrations**
  Run the following PowerShell script from `C:\git\pentachess-astro` to automatically crop the three hero illustrations from `redesign/Gemini_Generated_Image_idik9jidik9jidik.jpg` into `public/images/redesign/`:

  ```powershell
  New-Item -ItemType Directory -Force -Path "public/images/redesign" | Out-Null
  Add-Type -AssemblyName System.Drawing

  $srcPath = Resolve-Path "redesign/Gemini_Generated_Image_idik9jidik9jidik.jpg"
  $srcImage = [System.Drawing.Bitmap]::FromFile($srcPath)

  function Save-Crop($bitmap, [int]$x, [int]$y, [int]$w, [int]$h, [string]$outPath) {
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $cropped = $bitmap.Clone($rect, $bitmap.PixelFormat)
    $cropped.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropped.Dispose()
  }

  # 1. Hero Home: Kids playing chess at table (top-left card illustration)
  Save-Crop $srcImage 106 304 1060 720 (Join-Path (Get-Location) "public/images/redesign/hero-home.png")

  # 2. Hero Toernooien: Kids celebrating with trophy & chessboard (top-right card)
  Save-Crop $srcImage 1234 304 1060 654 (Join-Path (Get-Location) "public/images/redesign/hero-toernooien.png")

  # 3. Hero Schoolschaak: Teacher at demo board with students in classroom (bottom-right card)
  Save-Crop $srcImage 1234 1090 1060 608 (Join-Path (Get-Location) "public/images/redesign/hero-schoolschaak.png")

  $srcImage.Dispose()
  Write-Output "Cropped hero assets successfully."
  ```

- [x] **Task 0.2: Verify existing media assets used by the redesign**
  Ensure the following existing files in `public/wp-content/uploads/` remain untouched:
  - Logo: `/wp-content/uploads/2020/04/pentachess_logo.png`
  - Ambassador 1 (Liam Vrolijk): `/wp-content/uploads/2020/04/liamvrolijk.png`
  - Ambassador 2 (Anne Haast): `/wp-content/uploads/2020/04/haast.png`
  - Partners: `/wp-content/uploads/2020/04/mc-forte.png`, `/wp-content/uploads/2020/04/gemeente-vijfheerenlanden.jpg`, `/wp-content/uploads/2020/07/Knipsel.jpg`, `/wp-content/uploads/2021/03/greens.jpg`
  - Club Logos (for `/info/`): `/wp-content/uploads/2020/04/clubsliedrecht.png`, `clubmeerkerk.png`, `clubgiessenlinge.png`, `clubdordrecht.png`, `clubpascal.png`

---

## Phase 1: Design Tokens & Global Setup

- [x] **Task 1.1: Create `public/css/redesign.css` with strict brand tokens, typography, and layout utilities**
  Create `C:\git\pentachess-astro\public\css\redesign.css` with the exact contents below:

  ```css
  /* ==========================================================================
     Pentachess.nl Redesign System — Global Tokens, Reset & Utilities
     ========================================================================== */

  :root {
    /* Strict Brand Colors */
    --color-primary-green: #4CAF50;
    --color-primary-green-hover: #3d9140;
    --color-primary-green-light: #E8F5E9;
    --color-primary-blue: #1E88E5;
    --color-primary-blue-hover: #1565C0;
    --color-primary-blue-light: #E3F2FD;
    --color-bg-soft: #F4F9F4;
    --color-surface: #FFFFFF;
    --color-text-primary: #1A202C;
    --color-text-secondary: #4A5568;
    --color-border: #E2E8F0;

    /* Event Calendar Badge Accent Colors */
    --badge-green-bg: #4CAF50;
    --badge-blue-bg: #1E88E5;
    --badge-orange-bg: #F59E0B;
    --badge-pink-bg: #EC4899;
    --badge-purple-bg: #8B5CF6;

    /* Typography */
    --font-sans: 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

    /* Radii & Shadows */
    --radius-card: 16px;
    --radius-md: 12px;
    --radius-pill: 9999px;
    --shadow-card: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 4px 10px -3px rgba(0, 0, 0, 0.03);
    --shadow-card-hover: 0 18px 30px -5px rgba(0, 0, 0, 0.09), 0 6px 12px -3px rgba(0, 0, 0, 0.04);
    --shadow-header: 0 2px 15px rgba(0, 0, 0, 0.04);

    /* Layout */
    --container-max: 1200px;
    --container-narrow: 900px;
  }

  /* Base Reset */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: var(--font-sans);
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.6;
    color: var(--color-text-primary);
    background-color: var(--color-bg-soft);
    -webkit-font-smoothing: antialiased;
  }

  img, svg, video, iframe {
    max-width: 100%;
    height: auto;
    display: block;
  }

  /* Typography Hierarchy */
  h1, h2, h3, h4, h5, h6 {
    margin: 0 0 0.75rem 0;
    font-family: var(--font-sans);
    font-weight: 800;
    line-height: 1.2;
    color: var(--color-text-primary);
  }

  h1 { font-size: clamp(2rem, 4vw, 3rem); }
  h2 { font-size: clamp(1.5rem, 3vw, 2.125rem); }
  h3 { font-size: clamp(1.25rem, 2.2vw, 1.5rem); font-weight: 700; }
  h4 { font-size: 1.125rem; font-weight: 700; }

  p {
    margin: 0 0 1rem 0;
    color: var(--color-text-secondary);
  }

  a {
    color: var(--color-primary-blue);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: var(--color-primary-blue-hover);
  }

  /* Accessibility Utilities */
  .screen-reader-text {
    border: 0;
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute !important;
    width: 1px;
    word-wrap: normal !important;
  }

  .skip-link:focus {
    background-color: var(--color-surface);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-card-hover);
    clip: auto !important;
    clip-path: none;
    color: var(--color-primary-blue);
    display: block;
    font-size: 1rem;
    font-weight: 700;
    height: auto;
    left: 1rem;
    padding: 0.75rem 1.25rem;
    top: 1rem;
    width: auto;
    z-index: 100000;
  }

  /* Container & Section Utilities */
  .container {
    width: 100%;
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  .container-narrow {
    width: 100%;
    max-width: var(--container-narrow);
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  .section {
    padding: 4rem 0;
  }

  .section-alt {
    background-color: var(--color-surface);
    padding: 4rem 0;
  }

  .section-title {
    text-align: center;
    font-size: clamp(1.6rem, 3vw, 2.25rem);
    font-weight: 800;
    color: var(--color-text-primary);
    margin-bottom: 2.5rem;
  }

  /* Surface Card */
  .surface-card {
    background-color: var(--color-surface);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-card);
    padding: 2rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  /* Interactive Pill Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.6rem;
    border-radius: var(--radius-pill);
    font-family: var(--font-sans);
    font-weight: 700;
    font-size: 0.95rem;
    line-height: 1.2;
    text-decoration: none;
    cursor: pointer;
    border: 2px solid transparent;
    transition: transform 0.18s ease, background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease;
    white-space: nowrap;
  }

  .btn:hover {
    transform: translateY(-2px);
  }

  .btn-primary {
    background-color: var(--color-primary-green);
    color: #FFFFFF !important;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }

  .btn-primary:hover {
    background-color: var(--color-primary-green-hover);
    color: #FFFFFF !important;
    box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
  }

  .btn-secondary {
    background-color: var(--color-primary-blue);
    color: #FFFFFF !important;
    box-shadow: 0 4px 12px rgba(30, 136, 229, 0.28);
  }

  .btn-secondary:hover {
    background-color: var(--color-primary-blue-hover);
    color: #FFFFFF !important;
    box-shadow: 0 6px 16px rgba(30, 136, 229, 0.38);
  }

  .btn-outline-white {
    background-color: rgba(255, 255, 255, 0.12);
    color: #FFFFFF !important;
    border-color: #FFFFFF;
    backdrop-filter: blur(4px);
  }

  .btn-outline-white:hover {
    background-color: #FFFFFF;
    color: var(--color-primary-blue) !important;
  }

  .btn-outline-blue {
    background-color: transparent;
    color: var(--color-primary-blue) !important;
    border-color: var(--color-primary-blue);
  }

  .btn-outline-blue:hover {
    background-color: var(--color-primary-blue-light);
    color: var(--color-primary-blue-hover) !important;
  }

  .btn-outline-green {
    background-color: transparent;
    color: var(--color-primary-green) !important;
    border-color: var(--color-primary-green);
  }

  .btn-outline-green:hover {
    background-color: var(--color-primary-green-light);
    color: var(--color-primary-green-hover) !important;
  }

  .btn-sm {
    padding: 0.5rem 1.2rem;
    font-size: 0.875rem;
  }

  /* WordPress Content Compatibility (for Markdown posts & legacy HTML blocks) */
  .entry-content {
    color: var(--color-text-primary);
    font-size: 1.05rem;
    line-height: 1.75;
  }

  .entry-content p {
    color: var(--color-text-secondary);
    margin-bottom: 1.25rem;
  }

  .entry-content h2,
  .entry-content h3,
  .entry-content h4,
  .entry-content h5,
  .entry-content h6 {
    color: var(--color-text-primary) !important;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
  }

  .entry-content ul,
  .entry-content ol {
    margin: 0 0 1.25rem 1.5rem;
    color: var(--color-text-secondary);
  }

  .entry-content li {
    margin-bottom: 0.4rem;
  }

  .entry-content figure {
    margin: 1.5rem 0;
  }

  .entry-content img {
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-card);
  }

  .entry-content blockquote {
    margin: 1.5rem 0;
    padding: 1rem 1.5rem;
    border-left: 4px solid var(--color-primary-blue);
    background-color: var(--color-primary-blue-light);
    border-radius: 0 var(--radius-md) var(--radius-md) 0;
    color: var(--color-text-primary);
  }

  .entry-content blockquote p {
    margin: 0;
    color: var(--color-text-primary);
  }

  .entry-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    font-size: 0.95rem;
  }

  .entry-content th,
  .entry-content td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--color-border);
    text-align: left;
  }

  .entry-content th {
    background-color: var(--color-bg-soft);
    font-weight: 700;
  }

  /* Responsive 16:9 YouTube embeds */
  .wp-embed-aspect-16-9 .wp-block-embed__wrapper,
  .video-embed-wrapper {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    max-width: 100%;
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-card);
  }

  .wp-embed-aspect-16-9 .wp-block-embed__wrapper iframe,
  .video-embed-wrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
  ```

- [x] **Task 1.2: Update `src/layouts/BaseLayout.astro` to load Google Font `Nunito`, `redesign.css`, `Header`, and `Footer`**
  Replace the entire contents of `C:\git\pentachess-astro\src\layouts\BaseLayout.astro` with:

  ```astro
  ---
  import Header from '../components/Header.astro';
  import Footer from '../components/Footer.astro';

  interface Props {
    title: string;
    description?: string;
    bodyClass?: string;
  }

  const {
    title,
    description = 'Stichting Pentachess – Ontdek de magie van het schaakspel via onze jeugdtoernooien, schoolschaak en uitdagende schaaklessen in de regio.',
    bodyClass = ''
  } = Astro.props;
  ---

  <!DOCTYPE html>
  <html lang="nl-NL">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>{title}</title>
      <meta name="description" content={description} />

      <!-- Google Fonts: Nunito (400, 600, 700, 800) -->
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />

      <!-- Stylesheets -->
      <link rel="stylesheet" href="/css/block-library.css" media="all" />
      <link rel="stylesheet" href="/css/redesign.css" media="all" />
      <link rel="stylesheet" href="/css/print.css" media="print" />

      <!-- Favicons -->
      <link rel="icon" href="/wp-content/uploads/2020/04/cropped-pentachess_logo-32x32.png" sizes="32x32" />
      <link rel="icon" href="/wp-content/uploads/2020/04/cropped-pentachess_logo-192x192.png" sizes="192x192" />
      <link rel="apple-touch-icon" href="/wp-content/uploads/2020/04/cropped-pentachess_logo-180x180.png" />
      <meta name="msapplication-TileImage" content="/wp-content/uploads/2020/04/cropped-pentachess_logo-270x270.png" />
    </head>
    <body class={bodyClass}>
      <a class="skip-link screen-reader-text" href="#site-content">Overslaan naar de inhoud</a>

      <Header currentPath={Astro.url.pathname} />

      <main id="site-content" role="main">
        <slot />
      </main>

      <Footer />
    </body>
  </html>
  ```

---

## Phase 2: Core Shared UI Components

- [x] **Task 2.1: Create `src/components/Button.astro` (Interactive Pill Buttons)**
  Create `C:\git\pentachess-astro\src\components\Button.astro`:

  ```astro
  ---
  interface Props {
    href?: string;
    variant?: 'primary' | 'secondary' | 'outline-white' | 'outline-blue' | 'outline-green';
    size?: 'md' | 'sm';
    showArrow?: boolean;
    type?: 'button' | 'submit';
    class?: string;
  }

  const {
    href,
    variant = 'primary',
    size = 'md',
    showArrow = false,
    type = 'button',
    class: className = '',
  } = Astro.props;

  const classes = [
    'btn',
    `btn-${variant}`,
    size === 'sm' ? 'btn-sm' : '',
    className,
  ].filter(Boolean).join(' ');
  ---

  {href ? (
    <a href={href} class={classes}>
      <slot />
      {showArrow && (
        <span class="btn-arrow" aria-hidden="true">&rarr;</span>
      )}
    </a>
  ) : (
    <button type={type} class={classes}>
      <slot />
      {showArrow && (
        <span class="btn-arrow" aria-hidden="true">&rarr;</span>
      )}
    </button>
  )}

  <style>
    .btn-arrow {
      display: inline-block;
      transition: transform 0.18s ease;
    }
    .btn:hover .btn-arrow {
      transform: translateX(3px);
    }
  </style>
  ```

- [x] **Task 2.2: Update `src/components/Header.astro` (Sticky White Header + Desktop Nav + Mobile Drawer)**
  Replace `C:\git\pentachess-astro\src\components\Header.astro` with the new navigation bar matching the UX spec (`Home`, `Over Ons`, `Toernooien`, `Schoolschaak`, `Schaakles`, `Nieuws`, plus the green pill CTA `Doe mee!`):

  ```astro
  ---
  interface Props {
    currentPath?: string;
  }

  const { currentPath = '/' } = Astro.props;

  const normalizedPath =
    currentPath.endsWith('/') && currentPath.length > 1
      ? currentPath
      : currentPath === '/'
        ? '/'
        : `${currentPath}/`;

  const navItems = [
    { label: 'Home', href: '/', isActive: normalizedPath === '/' },
    { label: 'Over Ons', href: '/info/', isActive: normalizedPath.startsWith('/info/') },
    { label: 'Toernooien', href: '/toernooien/', isActive: normalizedPath.startsWith('/toernooien/') },
    { label: 'Schoolschaak', href: '/schoolschaak/', isActive: normalizedPath.startsWith('/schoolschaak/') },
    { label: 'Schaakles', href: '/schaakles/', isActive: normalizedPath.startsWith('/schaakles/') },
    {
      label: 'Nieuws',
      href: '/nieuws/',
      isActive: normalizedPath.startsWith('/nieuws/') || normalizedPath.startsWith('/author/'),
    },
  ];
  ---

  <header class="site-header" role="banner">
    <div class="container header-inner">
      <a href="/" class="logo-link" rel="home" aria-label="Pentachess.nl Home">
        <img
          src="/wp-content/uploads/2020/04/pentachess_logo.png"
          alt="pentachess.nl"
          width="165"
          height="96"
          class="logo-img"
          decoding="async"
          fetchpriority="high"
        />
      </a>

      <!-- Desktop Navigation -->
      <nav class="desktop-nav" aria-label="Hoofdnavigatie">
        <ul class="nav-list">
          {navItems.map((item) => (
            <li>
              <a
                href={item.href}
                class={`nav-link ${item.isActive ? 'is-active' : ''}`}
                {...(item.isActive ? { 'aria-current': 'page' } : {})}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="/toernooien/#kalender" class="btn btn-primary btn-sm nav-cta">
          Doe mee!
        </a>
      </nav>

      <!-- Mobile Hamburger Button -->
      <button
        type="button"
        class="mobile-menu-toggle"
        id="mobile-menu-toggle"
        aria-expanded="false"
        aria-controls="mobile-menu-drawer"
        aria-label="Menu openen"
      >
        <svg class="icon-hamburger" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        <svg class="icon-close" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <!-- Mobile Collapsible Drawer -->
    <div class="mobile-drawer" id="mobile-menu-drawer" hidden>
      <nav aria-label="Mobiele navigatie" class="container mobile-drawer-inner">
        <ul class="mobile-nav-list">
          {navItems.map((item) => (
            <li>
              <a
                href={item.href}
                class={`mobile-nav-link ${item.isActive ? 'is-active' : ''}`}
                {...(item.isActive ? { 'aria-current': 'page' } : {})}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="/toernooien/#kalender" class="btn btn-primary mobile-cta">
          Doe mee!
        </a>
      </nav>
    </div>
  </header>

  <style>
    .site-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background-color: var(--color-surface);
      box-shadow: var(--shadow-header);
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 80px;
      gap: 1.5rem;
    }

    .logo-link {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .logo-img {
      height: 54px;
      width: auto;
      object-fit: contain;
    }

    .desktop-nav {
      display: none;
      align-items: center;
      gap: 2rem;
    }

    @media (min-width: 960px) {
      .desktop-nav {
        display: flex;
      }
    }

    .nav-list {
      display: flex;
      align-items: center;
      gap: 1.75rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-link {
      font-family: var(--font-sans);
      font-weight: 600;
      font-size: 1rem;
      color: var(--color-text-primary);
      text-decoration: none;
      padding: 0.35rem 0;
      position: relative;
      transition: color 0.2s ease;
    }

    .nav-link:hover,
    .nav-link.is-active {
      color: var(--color-primary-green);
    }

    .nav-link.is-active::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: -2px;
      height: 3px;
      border-radius: 999px;
      background-color: var(--color-primary-green);
    }

    .nav-cta {
      padding: 0.6rem 1.4rem;
      font-size: 0.95rem;
    }

    .mobile-menu-toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 0.5rem;
      color: var(--color-text-primary);
      cursor: pointer;
    }

    .mobile-menu-toggle .icon-close {
      display: none;
    }

    .mobile-menu-toggle[aria-expanded='true'] .icon-hamburger {
      display: none;
    }

    .mobile-menu-toggle[aria-expanded='true'] .icon-close {
      display: block;
    }

    @media (min-width: 960px) {
      .mobile-menu-toggle {
        display: none;
      }
    }

    .mobile-drawer {
      background-color: var(--color-surface);
      border-top: 1px solid var(--color-border);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    }

    .mobile-drawer-inner {
      padding-top: 1rem;
      padding-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .mobile-nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .mobile-nav-link {
      display: block;
      padding: 0.65rem 0.75rem;
      border-radius: var(--radius-md);
      font-weight: 700;
      color: var(--color-text-primary);
      text-decoration: none;
    }

    .mobile-nav-link:hover,
    .mobile-nav-link.is-active {
      background-color: var(--color-bg-soft);
      color: var(--color-primary-green);
    }

    .mobile-cta {
      width: 100%;
      text-align: center;
    }
  </style>

  <script>
    function initMobileMenu() {
      const btn = document.getElementById('mobile-menu-toggle');
      const drawer = document.getElementById('mobile-menu-drawer');
      if (!btn || !drawer) return;

      btn.addEventListener('click', () => {
        const isOpen = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!isOpen));
        if (isOpen) {
          drawer.setAttribute('hidden', '');
        } else {
          drawer.removeAttribute('hidden');
        }
      });
    }

    initMobileMenu();
    document.addEventListener('astro:after-swap', initMobileMenu);
  </script>
  ```

- [x] **Task 2.3: Create `src/components/Footer.astro`**
  Create `C:\git\pentachess-astro\src\components\Footer.astro`:

  ```astro
  ---
  const currentYear = new Date().getFullYear();
  ---

  <footer class="site-footer" role="contentinfo">
    <div class="container footer-grid">
      <div class="footer-brand">
        <a href="/" class="footer-logo-link">
          <img
            src="/wp-content/uploads/2020/04/pentachess_logo.png"
            alt="Stichting Pentachess"
            width="150"
            height="87"
            loading="lazy"
          />
        </a>
        <p class="footer-desc">
          Stichting Pentachess bevordert de jeugdschaaksport in de Merwede- en Vijfheerenlanden-regio via toernooien, schoolschaak en schaaktrainingen.
        </p>
        <p class="footer-meta">RSIN: 8602.39.160</p>
      </div>

      <div class="footer-col">
        <h4>Snel naar</h4>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/over-ons/" onclick="window.location.href='/info/'; return false;">Over Ons</a></li>
          <li><a href="/info/">Over Stichting Pentachess</a></li>
          <li><a href="/toernooien/">Toernooien & Kalender</a></li>
          <li><a href="/schoolschaak/">Schoolschaak</a></li>
          <li><a href="/schaakles/">Schaakles</a></li>
          <li><a href="/nieuws/">Laatste Nieuws</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Aangesloten Clubs</h4>
        <ul>
          <li>Schaakvereniging Dordrecht</li>
          <li>Schaakvereniging Pascal (Papendrecht)</li>
          <li>Schaakvereniging Sliedrecht</li>
          <li>Schaakvereniging Giessen en Linge</li>
          <li>Meerkerk Schaakt</li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Contact</h4>
        <p>Wil je een gratis clinic op school, meedoen aan een toernooi of schaakles volgen?</p>
        <a href="mailto:pentachess@gmail.com" class="footer-mail">pentachess@gmail.com</a>
        <div style="margin-top: 1rem;">
          <a href="/schoolschaak/#aanmelden" class="btn btn-primary btn-sm">Meld je school aan &rarr;</a>
        </div>
      </div>
    </div>

    <div class="container footer-bottom">
      <p>&copy; {currentYear} Stichting Pentachess (pentachess.nl). Alle rechten voorbehouden.</p>
    </div>
  </footer>

  <style>
    .site-footer {
      background-color: var(--color-surface);
      border-top: 1px solid var(--color-border);
      padding: 4rem 0 2rem;
      margin-top: 4rem;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }

    @media (min-width: 768px) {
      .footer-grid {
        grid-template-columns: 1.4fr 1fr 1fr 1.2fr;
      }
    }

    .footer-logo-link img {
      height: 52px;
      width: auto;
      margin-bottom: 1rem;
    }

    .footer-desc {
      font-size: 0.95rem;
      color: var(--color-text-secondary);
      margin-bottom: 0.5rem;
    }

    .footer-meta {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--color-text-secondary);
    }

    .footer-col h4 {
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--color-text-primary);
      margin-bottom: 1rem;
    }

    .footer-col ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .footer-col li,
    .footer-col a {
      font-size: 0.95rem;
      color: var(--color-text-secondary);
      text-decoration: none;
    }

    .footer-col a:hover {
      color: var(--color-primary-green);
    }

    .footer-mail {
      font-weight: 700;
      color: var(--color-primary-blue) !important;
      display: inline-block;
    }

    .footer-bottom {
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--color-border);
      text-align: center;
    }

    .footer-bottom p {
      margin: 0;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }
  </style>
  ```

- [x] **Task 2.4: Create `src/components/HeroSection.astro` (Reusable Split 2-Column Wave Hero)**
  Create `C:\git\pentachess-astro\src\components\HeroSection.astro` featuring the Blue (`#1E88E5`) to Green (`#4CAF50`) wave background, layered organic SVG shapes, curved SVG bottom divider transitioning into `#F4F9F4`, left column with H1/subtitle/2 CTAs, and right column with page-specific illustration:

  ```astro
  ---
  import Button from './Button.astro';

  interface Props {
    title: string;
    subtitle: string;
    primaryCtaText?: string;
    primaryCtaHref?: string;
    secondaryCtaText?: string;
    secondaryCtaHref?: string;
    imageSrc: string;
    imageAlt: string;
  }

  const {
    title,
    subtitle,
    primaryCtaText = 'Bekijk Toernooien',
    primaryCtaHref = '/toernooien/',
    secondaryCtaText = 'Onze Schaaklessen',
    secondaryCtaHref = '/schaakles/',
    imageSrc,
    imageAlt,
  } = Astro.props;
  ---

  <section class="hero-wave-section">
    <!-- Layered organic wave background -->
    <div class="hero-bg-shapes" aria-hidden="true">
      <svg class="hero-bg-svg" viewBox="0 0 1440 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1E88E5" />
            <stop offset="58%" stop-color="#1996B4" />
            <stop offset="100%" stop-color="#4CAF50" />
          </linearGradient>
        </defs>
        <rect width="1440" height="600" fill="url(#heroGrad)" />
        <path
          d="M0,160 C320,40 520,300 900,140 C1150,40 1320,120 1440,80 L1440,600 L0,600 Z"
          fill="#4CAF50"
          fill-opacity="0.28"
        />
        <path
          d="M0,340 C380,220 720,460 1120,260 C1280,180 1380,220 1440,200 L1440,600 L0,600 Z"
          fill="#1565C0"
          fill-opacity="0.22"
        />
      </svg>
    </div>

    <div class="container hero-grid">
      <div class="hero-content">
        <h1 class="hero-title">{title}</h1>
        <p class="hero-subtitle">{subtitle}</p>
        <div class="hero-actions">
          {primaryCtaText && (
            <Button href={primaryCtaHref} variant="primary">
              {primaryCtaText}
            </Button>
          )}
          {secondaryCtaText && (
            <Button href={secondaryCtaHref} variant="outline-white">
              {secondaryCtaText}
            </Button>
          )}
        </div>
      </div>

      <div class="hero-illustration-wrap">
        <div class="hero-illustration-card">
          <img
            src={imageSrc}
            alt={imageAlt}
            width="560"
            height="380"
            class="hero-illustration-img"
            decoding="async"
            fetchpriority="high"
          />
        </div>
      </div>
    </div>

    <!-- Bottom SVG Curved River Wave Divider -->
    <div class="hero-wave-bottom" aria-hidden="true">
      <svg viewBox="0 0 1440 110" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0,48 C280,115 560,110 860,48 C1120,-6 1310,18 1440,56 L1440,110 L0,110 Z"
          fill="#4CAF50"
          fill-opacity="0.45"
        />
        <path
          d="M0,64 C320,120 640,96 960,40 C1180,2 1340,28 1440,68 L1440,110 L0,110 Z"
          fill="#F4F9F4"
        />
      </svg>
    </div>
  </section>

  <style>
    .hero-wave-section {
      position: relative;
      overflow: hidden;
      padding: 3.5rem 0 6.5rem;
      color: #FFFFFF;
    }

    @media (min-width: 960px) {
      .hero-wave-section {
        padding: 4.5rem 0 7.5rem;
      }
    }

    .hero-bg-shapes {
      position: absolute;
      inset: 0;
      z-index: 0;
    }

    .hero-bg-svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .hero-grid {
      position: relative;
      z-index: 2;
      display: grid;
      grid-template-columns: 1fr;
      align-items: center;
      gap: 2.5rem;
    }

    @media (min-width: 960px) {
      .hero-grid {
        grid-template-columns: 1.05fr 0.95fr;
        gap: 3rem;
      }
    }

    .hero-title {
      color: #FFFFFF;
      font-size: clamp(2.25rem, 4.5vw, 3.35rem);
      font-weight: 800;
      line-height: 1.12;
      margin-bottom: 1rem;
      letter-spacing: -0.01em;
    }

    .hero-subtitle {
      color: rgba(255, 255, 255, 0.92);
      font-size: clamp(1.05rem, 1.8vw, 1.2rem);
      line-height: 1.6;
      margin-bottom: 2rem;
      max-width: 540px;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .hero-illustration-wrap {
      display: flex;
      justify-content: center;
    }

    .hero-illustration-card {
      background: rgba(255, 255, 255, 0.14);
      padding: 0.65rem;
      border-radius: 24px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.16);
      backdrop-filter: blur(6px);
      max-width: 540px;
      width: 100%;
    }

    .hero-illustration-img {
      width: 100%;
      height: auto;
      border-radius: 18px;
      object-fit: cover;
      display: block;
    }

    .hero-wave-bottom {
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      z-index: 1;
      line-height: 0;
    }

    .hero-wave-bottom svg {
      width: 100%;
      height: 75px;
      display: block;
    }

    @media (min-width: 960px) {
      .hero-wave-bottom svg {
        height: 105px;
      }
    }
  </style>
  ```

- [x] **Task 2.5: Create `src/components/FocusAreaCard.astro` ("Aandachtsgebieden" Card with Custom SVG Illustration)**
  Create `C:\git\pentachess-astro\src\components\FocusAreaCard.astro` with custom inline SVG illustrations matching the redesign mockup (Trophy + Chessboard for `toernooien`, School Building + Green Pawn for `schoolschaak`, and Trainer + Pawn + Chessboard for `schaakles`):

  ```astro
  ---
  interface Props {
    title: string;
    description: string;
    href: string;
    iconType: 'toernooien' | 'schoolschaak' | 'schaakles';
  }

  const { title, description, href, iconType } = Astro.props;
  ---

  <article class="surface-card focus-card">
    <div class="focus-illustration" aria-hidden="true">
      {iconType === 'toernooien' && (
        <svg viewBox="0 0 180 96" width="160" height="86" xmlns="http://www.w3.org/2000/svg">
          <!-- Gold Trophy -->
          <path d="M24 22 H68 V42 C68 56 56 66 46 66 C36 66 24 56 24 42 Z" fill="#F59E0B" stroke="#1A202C" stroke-width="3"/>
          <path d="M24 28 H14 C14 42 20 48 26 48" fill="none" stroke="#1A202C" stroke-width="3" stroke-linecap="round"/>
          <path d="M68 28 H78 C78 42 72 48 66 48" fill="none" stroke="#1A202C" stroke-width="3" stroke-linecap="round"/>
          <rect x="41" y="66" width="10" height="12" fill="#D97706" stroke="#1A202C" stroke-width="3"/>
          <rect x="28" y="78" width="36" height="8" rx="3" fill="#92400E" stroke="#1A202C" stroke-width="3"/>
          <polygon points="46,30 49,37 56,37 50,41 52,48 46,44 40,48 42,41 36,37 43,37" fill="#FEF3C7" stroke="#1A202C" stroke-width="1.5"/>
          <!-- Mini Chessboard -->
          <rect x="96" y="16" width="68" height="68" rx="6" fill="#FFFFFF" stroke="#1A202C" stroke-width="3"/>
          <g fill="#4A5568">
            <rect x="102" y="22" width="14" height="14"/><rect x="130" y="22" width="14" height="14"/>
            <rect x="116" y="36" width="14" height="14"/><rect x="144" y="36" width="14" height="14"/>
            <rect x="102" y="50" width="14" height="14"/><rect x="130" y="50" width="14" height="14"/>
            <rect x="116" y="64" width="14" height="14"/><rect x="144" y="64" width="14" height="14"/>
          </g>
        </svg>
      )}

      {iconType === 'schoolschaak' && (
        <svg viewBox="0 0 180 96" width="160" height="86" xmlns="http://www.w3.org/2000/svg">
          <!-- School Building -->
          <polygon points="22,42 64,18 106,42" fill="#EF4444" stroke="#1A202C" stroke-width="3" stroke-linejoin="round"/>
          <rect x="28" y="42" width="72" height="42" fill="#FBBF24" stroke="#1A202C" stroke-width="3"/>
          <rect x="54" y="58" width="20" height="26" fill="#92400E" stroke="#1A202C" stroke-width="3"/>
          <circle cx="64" cy="34" r="7" fill="#FFFFFF" stroke="#1A202C" stroke-width="2.5"/>
          <rect x="35" y="49" width="12" height="12" fill="#93C5FD" stroke="#1A202C" stroke-width="2.5"/>
          <rect x="81" y="49" width="12" height="12" fill="#93C5FD" stroke="#1A202C" stroke-width="2.5"/>
          <!-- Green Chess Pawn -->
          <circle cx="140" cy="34" r="11" fill="#4CAF50" stroke="#1A202C" stroke-width="3"/>
          <path d="M128 76 C130 56 134 48 140 48 C146 48 150 56 152 76 Z" fill="#4CAF50" stroke="#1A202C" stroke-width="3"/>
          <rect x="124" y="76" width="32" height="8" rx="4" fill="#4CAF50" stroke="#1A202C" stroke-width="3"/>
        </svg>
      )}

      {iconType === 'schaakles' && (
        <svg viewBox="0 0 180 96" width="160" height="86" xmlns="http://www.w3.org/2000/svg">
          <!-- Trainer / Coach Character -->
          <circle cx="46" cy="32" r="14" fill="#FDE68A" stroke="#1A202C" stroke-width="3"/>
          <path d="M32 30 C32 20 60 20 60 30" fill="#78350F" stroke="#1A202C" stroke-width="3"/>
          <path d="M22 82 C22 60 34 52 46 52 C58 52 70 60 70 82 Z" fill="#1E88E5" stroke="#1A202C" stroke-width="3"/>
          <!-- Small Green Pawn -->
          <circle cx="76" cy="56" r="7" fill="#4CAF50" stroke="#1A202C" stroke-width="2.5"/>
          <path d="M68 82 L72 64 H80 L84 82 Z" fill="#4CAF50" stroke="#1A202C" stroke-width="2.5"/>
          <!-- Mini Chessboard -->
          <rect x="98" y="16" width="68" height="68" rx="6" fill="#FFFFFF" stroke="#1A202C" stroke-width="3"/>
          <g fill="#4A5568">
            <rect x="104" y="22" width="14" height="14"/><rect x="132" y="22" width="14" height="14"/>
            <rect x="118" y="36" width="14" height="14"/><rect x="146" y="36" width="14" height="14"/>
            <rect x="104" y="50" width="14" height="14"/><rect x="132" y="50" width="14" height="14"/>
            <rect x="118" y="64" width="14" height="14"/><rect x="146" y="64" width="14" height="14"/>
          </g>
        </svg>
      )}
    </div>

    <h3 class="focus-title">{title}</h3>
    <p class="focus-desc">{description}</p>
    <a href={href} class="focus-link">
      Lees meer <span aria-hidden="true">&rarr;</span>
    </a>
  </article>

  <style>
    .focus-card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      height: 100%;
    }

    .focus-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-card-hover);
    }

    .focus-illustration {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0.5rem 0 1.25rem;
    }

    .focus-title {
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--color-text-primary);
      margin-bottom: 0.6rem;
    }

    .focus-desc {
      font-size: 0.96rem;
      color: var(--color-text-secondary);
      line-height: 1.6;
      margin-bottom: 1.25rem;
      flex-grow: 1;
    }

    .focus-link {
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--color-primary-blue);
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }

    .focus-link span {
      transition: transform 0.18s ease;
    }

    .focus-link:hover span {
      transform: translateX(4px);
    }
  </style>
  ```

- [x] **Task 2.6: Create `src/components/NewsCard.astro` (News Grid Card with Automatic First-Image Extraction)**
  Create `C:\git\pentachess-astro\src\components\NewsCard.astro` which extracts the first image from a Markdown post's raw body (`post.body`) or falls back to a Pentachess illustration, formats the date in Dutch, and displays a clean card:

  ```astro
  ---
  import type { CollectionEntry } from 'astro:content';

  interface Props {
    post: CollectionEntry<'posts'>;
  }

  const { post } = Astro.props;

  function extractFirstImage(body: string | undefined): string {
    if (!body) return '/wp-content/uploads/2020/04/slide1.jpg';
    const htmlMatch = body.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (htmlMatch && htmlMatch[1]) return htmlMatch[1];
    const mdMatch = body.match(/!\[[^\]]*\]\(([^)]+)\)/);
    if (mdMatch && mdMatch[1]) return mdMatch[1];
    return '/wp-content/uploads/2020/04/slide1.jpg';
  }

  function formatShortDutchDate(date: Date): string {
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }

  function cleanExcerpt(excerpt: string | undefined): string {
    if (!excerpt) return '';
    return excerpt
      .replace(/\[&hellip;\]/g, '…')
      .replace(/&#8220;|&#8221;/g, '"')
      .replace(/&#8211;/g, '–')
      .trim();
  }

  const thumbnail = extractFirstImage(post.body);
  const formattedDate = formatShortDutchDate(post.data.date);
  const excerptText = cleanExcerpt(post.data.excerpt);
  ---

  <article class="news-card">
    <a href={`/nieuws/${post.slug}/`} class="news-card-img-link" tabindex="-1" aria-hidden="true">
      <img
        src={thumbnail}
        alt={post.data.title}
        loading="lazy"
        decoding="async"
        class="news-card-img"
      />
    </a>
    <div class="news-card-body">
      <time datetime={post.data.date.toISOString()} class="news-card-date">
        {formattedDate}
      </time>
      <h3 class="news-card-title">
        <a href={`/nieuws/${post.slug}/`}>{post.data.title}</a>
      </h3>
      {excerptText && <p class="news-card-excerpt">{excerptText}</p>}
      <a href={`/nieuws/${post.slug}/`} class="news-card-more">
        Lees meer <span aria-hidden="true">&rarr;</span>
      </a>
    </div>
  </article>

  <style>
    .news-card {
      background-color: var(--color-surface);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-card);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .news-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-card-hover);
    }

    .news-card-img-link {
      display: block;
      aspect-ratio: 16 / 10;
      overflow: hidden;
      background-color: var(--color-bg-soft);
    }

    .news-card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.35s ease;
    }

    .news-card:hover .news-card-img {
      transform: scale(1.04);
    }

    .news-card-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .news-card-date {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-text-secondary);
      margin-bottom: 0.4rem;
    }

    .news-card-title {
      font-size: 1.15rem;
      font-weight: 800;
      line-height: 1.35;
      margin-bottom: 0.65rem;
    }

    .news-card-title a {
      color: var(--color-text-primary);
      text-decoration: none;
    }

    .news-card-title a:hover {
      color: var(--color-primary-blue);
    }

    .news-card-excerpt {
      font-size: 0.925rem;
      color: var(--color-text-secondary);
      line-height: 1.55;
      margin-bottom: 1.25rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex-grow: 1;
    }

    .news-card-more {
      font-weight: 700;
      font-size: 0.92rem;
      color: var(--color-primary-blue);
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      margin-top: auto;
    }
  </style>
  ```

- [x] **Task 2.7: Create `src/components/AmbassadorCards.astro` (Shared Profile Cards for Liam Vrolijk & Anne Haast)**
  Create `C:\git\pentachess-astro\src\components\AmbassadorCards.astro` matching the "Kaarten & Infographics" mockup (colored top banner in `#4CAF50` / `#1E88E5`, white chess pawn icon in top right, circular overlapping avatar, name, title, and bio):

  ```astro
  ---
  const ambassadors = [
    {
      name: 'Liam Vrolijk',
      role: '(Grootmeester)',
      avatar: '/wp-content/uploads/2020/04/liamvrolijk.png',
      bannerColor: 'green',
      bio: 'Liam Vrolijk is een Nederlandse top jeugdschaker en internationaal grootmeester (GM). Als ambassadeur van Stichting Pentachess hoopt hij meer kinderen geïnteresseerd te krijgen in het schaakspel.',
    },
    {
      name: 'Anne Haast',
      role: '(WGM)',
      avatar: '/wp-content/uploads/2020/04/haast.png',
      bannerColor: 'blue',
      bio: 'Anne Haast is een Nederlandse topschaakster en Woman Grandmaster (WGM). Ze heeft meermalen het NK schaken voor vrouwen gewonnen en zet zich enthousiast in voor het bevorderen van jeugdschaak en trainingen.',
    },
  ];
  ---

  <div class="ambassadors-grid">
    {ambassadors.map((person) => (
      <article class="ambassador-card">
        <div class={`ambassador-banner banner-${person.bannerColor}`}>
          <svg class="banner-pawn-icon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="6" r="4" />
            <path d="M9 11h6l1.5 6H7.5L9 11z" />
            <rect x="6" y="18" width="12" height="2.5" rx="1.2" />
          </svg>
        </div>

        <div class="ambassador-avatar-wrap">
          <img
            src={person.avatar}
            alt={person.name}
            width="96"
            height="96"
            loading="lazy"
            class="ambassador-avatar"
          />
        </div>

        <div class="ambassador-body">
          <h3 class="ambassador-name">{person.name}</h3>
          <p class="ambassador-role">{person.role}</p>
          <p class="ambassador-bio">{person.bio}</p>
        </div>
      </article>
    ))}
  </div>

  <style>
    .ambassadors-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      max-width: 820px;
      margin: 0 auto;
    }

    @media (min-width: 700px) {
      .ambassadors-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .ambassador-card {
      background-color: var(--color-surface);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-card);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .ambassador-banner {
      height: 76px;
      position: relative;
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      padding: 1rem;
    }

    .banner-green {
      background-color: var(--color-primary-green);
    }

    .banner-blue {
      background-color: var(--color-primary-blue);
    }

    .banner-pawn-icon {
      color: #FFFFFF;
      opacity: 0.9;
    }

    .ambassador-avatar-wrap {
      margin-top: -44px;
      padding: 0 1.75rem;
      z-index: 2;
    }

    .ambassador-avatar {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid var(--color-surface);
      background-color: var(--color-bg-soft);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    }

    .ambassador-body {
      padding: 1rem 1.75rem 1.75rem;
    }

    .ambassador-name {
      font-size: 1.25rem;
      font-weight: 800;
      margin-bottom: 0.1rem;
      color: var(--color-text-primary);
    }

    .ambassador-role {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--color-text-primary);
      margin-bottom: 0.75rem;
    }

    .ambassador-bio {
      font-size: 0.925rem;
      color: var(--color-text-secondary);
      line-height: 1.6;
      margin: 0;
    }
  </style>
  ```

---

## Phase 3: Homepage Implementation (`/`)

- [x] **Task 3.1: Replace `src/pages/index.astro` with the Redesigned Homepage**
  Update `C:\git\pentachess-astro\src\pages\index.astro` to render:
  1. `<HeroSection />` (`"Schaken is voor iedereen!"`, subtitle, `"Bekijk Toernooien"` & `"Onze Schaaklessen"`, `hero-home.png`).
  2. Section **"Aandachtsgebieden"** (`3`-column responsive grid of `<FocusAreaCard />` components for `Toernooien`, `Schoolschaak`, and `Schaakles`).
  3. Section **"Laatste Nieuws"** (`3`-column responsive grid of `<NewsCard />` dynamically populated from `getCollection('posts')` + button to `/nieuws/`).
  4. Section **"Ambassadeurs"** (`<AmbassadorCards />` for Liam Vrolijk & Anne Haast).
  5. Section **"Partners en sponsors"** (clean white sponsor cards preserving MC Forte, Gemeente Vijfheerenlanden, De Notarissen, and Greens International).

  Write the following exact code to `C:\git\pentachess-astro\src\pages\index.astro`:

  ```astro
  ---
  import BaseLayout from '../layouts/BaseLayout.astro';
  import HeroSection from '../components/HeroSection.astro';
  import FocusAreaCard from '../components/FocusAreaCard.astro';
  import NewsCard from '../components/NewsCard.astro';
  import AmbassadorCards from '../components/AmbassadorCards.astro';
  import Button from '../components/Button.astro';
  import { getCollection } from 'astro:content';

  const allPosts = await getCollection('posts');
  const latestPosts = allPosts
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, 3);

  const focusAreas = [
    {
      title: 'Toernooien',
      description:
        'De oorsprong van Pentachess is de organisatie van de succesvolle Merwede jeugdviertallen competitie. Dit zetten we door met het organiseren van jeugdtoernooien en toernooibegeleiding.',
      href: '/toernooien/',
      iconType: 'toernooien' as const,
    },
    {
      title: 'Schoolschaak',
      description:
        'Door middel van schoolschaak activiteiten laat Pentachess zo veel mogelijk jeugd kennismaken met schaken. Scholen kunnen bij ons terecht voor trainers, lespakketten en Chessity.',
      href: '/schoolschaak/',
      iconType: 'schoolschaak' as const,
    },
    {
      title: 'Schaakles',
      description:
        'Voor gemotiveerde jeugdschakers, vanuit de verenigingen of daarbuiten, biedt Pentachess uitdagende trainingen aan en leiden wij nieuwe schaaktrainers op.',
      href: '/schaakles/',
      iconType: 'schaakles' as const,
    },
  ];
  ---

  <BaseLayout title="Pentachess – Schaken is voor iedereen!">
    <!-- 1. Hero Section -->
    <HeroSection
      title="Schaken is voor iedereen!"
      subtitle="Ontdek de magie van het schaakspel via onze toernooien, schoolschaak en uitdagende lessen."
      primaryCtaText="Bekijk Toernooien"
      primaryCtaHref="/toernooien/"
      secondaryCtaText="Onze Schaaklessen"
      secondaryCtaHref="/schaakles/"
      imageSrc="/images/redesign/hero-home.png"
      imageAlt="Kinderen spelen schaak aan tafel met vrolijke schaakstukken"
    />

    <!-- 2. Section: Aandachtsgebieden -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">Aandachtsgebieden</h2>
        <div class="grid-3">
          {focusAreas.map((area) => (
            <FocusAreaCard
              title={area.title}
              description={area.description}
              href={area.href}
              iconType={area.iconType}
            />
          ))}
        </div>
      </div>
    </section>

    <!-- 3. Section: Laatste Nieuws -->
    <section class="section section-alt">
      <div class="container">
        <h2 class="section-title">Laatste Nieuws</h2>
        <div class="grid-3">
          {latestPosts.map((post) => (
            <NewsCard post={post} />
          ))}
        </div>
        <div class="section-cta">
          <Button href="/nieuws/" variant="outline-blue" showArrow={true}>
            Bekijk al het nieuws
          </Button>
        </div>
      </div>
    </section>

    <!-- 4. Section: Ambassadeurs -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">Onze Ambassadeurs</h2>
        <AmbassadorCards />
      </div>
    </section>

    <!-- 5. Section: Partners en sponsors -->
    <section class="section section-alt">
      <div class="container">
        <h2 class="section-title">Partners en sponsors</h2>
        <div class="sponsors-grid">
          <div class="surface-card sponsor-card">
            <img
              src="/wp-content/uploads/2020/04/mc-forte.png"
              alt="MC Forte"
              loading="lazy"
              class="sponsor-logo"
            />
            <h3>MC Forte</h3>
            <p>
              MC Forte heeft veel ervaring in het aanbieden van muziekclinics en lessen aan basisscholen in de regio. We werken samen om een goed schaakaanbod te bieden aan basisscholen.
            </p>
          </div>

          <div class="surface-card sponsor-card">
            <img
              src="/wp-content/uploads/2020/04/gemeente-vijfheerenlanden.jpg"
              alt="Gemeente Vijfheerenlanden"
              loading="lazy"
              class="sponsor-logo"
            />
            <h3>Gemeente Vijfheerenlanden</h3>
            <p>De gemeente Vijfheerenlanden steunt de Stichting Pentachess.</p>
          </div>

          <div class="surface-card sponsor-card">
            <a href="http://www.greens-international.nl/index.html" target="_blank" rel="noopener noreferrer">
              <img
                src="/wp-content/uploads/2021/03/greens.jpg"
                alt="Greens International"
                loading="lazy"
                class="sponsor-logo"
              />
            </a>
            <h3>Greens International</h3>
            <p>
              Wegwijzer in duurzaamheid: milieu, arbo en kwaliteit! Greens International ondersteunt met de ZOOM accounts voor de online trainingen.
            </p>
          </div>

          <div class="surface-card sponsor-card">
            <a href="http://denotarissen.nl" target="_blank" rel="noopener noreferrer">
              <img
                src="/wp-content/uploads/2020/07/Knipsel.jpg"
                alt="De Notarissen"
                loading="lazy"
                class="sponsor-logo"
              />
            </a>
            <h3>De Notarissen</h3>
            <p>
              Onze statuten zijn gepasseerd bij <a href="http://denotarissen.nl" target="_blank" rel="noopener noreferrer">denotarissen.nl</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  </BaseLayout>

  <style>
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    @media (min-width: 768px) {
      .grid-3 {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .section-cta {
      margin-top: 2.5rem;
      text-align: center;
    }

    .sponsors-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.75rem;
    }

    @media (min-width: 640px) {
      .sponsors-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .sponsors-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .sponsor-card {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .sponsor-logo {
      height: 84px;
      width: auto;
      object-fit: contain;
      margin-bottom: 1rem;
    }

    .sponsor-card h3 {
      font-size: 1.15rem;
      margin-bottom: 0.5rem;
    }

    .sponsor-card p {
      font-size: 0.9rem;
      margin: 0;
    }
  </style>
  ```

---

## Phase 4: Toernooien Page Implementation (`/toernooien`)

- [x] **Task 4.1: Create `src/data/tournaments.ts` with Real Calendar Events & Viertallencompetitie Standings**
  Create `C:\git\pentachess-astro\src\data\tournaments.ts` containing the structured tournament calendar and the official 2025–2026 Viertallencompetitie final standings (sourced directly from `src/content/posts/activiteiten-kalender-pentachess-2025-2026.md`, `onjk-snelschaak-25-oktober-gorinchem.md`, and `pentachess-viertallencompetitie-2025-2026-einduitslagen.md`):

  ```ts
  export interface CalendarEvent {
    badge: string;
    badgeColor: 'green' | 'blue' | 'orange' | 'pink' | 'purple';
    dateLabel: string;
    title: string;
    href: string;
    ctaLabel: string;
  }

  export interface TeamStanding {
    rank: number;
    team: string;
    played: number;
    matchPoints: number;
    boardPoints: string;
  }

  export const calendarEvents: CalendarEvent[] = [
    {
      badge: 'Gorinchem',
      badgeColor: 'green',
      dateLabel: '25 Okt',
      title: 'ONJK Snelschaken Gorinchem',
      href: 'https://onjk.snelschaken.pentachess.nl/',
      ctaLabel: 'Inschrijven',
    },
    {
      badge: 'Sliedrecht',
      badgeColor: 'blue',
      dateLabel: '12 Dec',
      title: 'Regiocompetitie Viertallen – Ronde 1 Sliedrecht',
      href: '/nieuws/uitslagen-viertallentoernooi-sliedrecht-12-december-2025/',
      ctaLabel: 'Inschrijven',
    },
    {
      badge: 'Dordrecht',
      badgeColor: 'orange',
      dateLabel: '13 Feb',
      title: 'Regiocompetitie Viertallen – Ronde 2 Dordrecht',
      href: '/nieuws/uitslagen-viertallentoernooi-dordrecht-13-februari-2026/',
      ctaLabel: 'Inschrijven',
    },
    {
      badge: 'Meerkerk',
      badgeColor: 'pink',
      dateLabel: '20 Mrt',
      title: 'Regiocompetitie Viertallen – Ronde 3 Meerkerk',
      href: '/nieuws/activiteiten-kalender-pentachess-2025-2026/',
      ctaLabel: 'Inschrijven',
    },
    {
      badge: 'Gorinchem',
      badgeColor: 'purple',
      dateLabel: '17 Apr',
      title: 'Regiocompetitie Viertallen – Ronde 4 Gorinchem',
      href: '/nieuws/activiteiten-kalender-pentachess-2025-2026/',
      ctaLabel: 'Inschrijven',
    },
    {
      badge: 'Papendrecht',
      badgeColor: 'green',
      dateLabel: '8 Mei',
      title: 'Regiocompetitie Viertallen – Slotronde Papendrecht',
      href: '/nieuws/pentachess-viertallencompetitie-2025-2026-einduitslagen/',
      ctaLabel: 'Uitslagen',
    },
  ];

  export const viertallenStandings: TeamStanding[] = [
    { rank: 1, team: 'Giessen en Linge 1', played: 15, matchPoints: 36, boardPoints: '43,5' },
    { rank: 2, team: 'Sliedrecht 1', played: 15, matchPoints: 34, boardPoints: '46,0' },
    { rank: 3, team: 'Giessen en Linge 2', played: 15, matchPoints: 24, boardPoints: '33,0' },
    { rank: 4, team: 'Dordrecht 1', played: 11, matchPoints: 22, boardPoints: '25,5' },
    { rank: 5, team: 'Giessen en Linge 3', played: 14, matchPoints: 21, boardPoints: '28,0' },
    { rank: 6, team: 'PASCAL 1', played: 14, matchPoints: 19, boardPoints: '23,5' },
    { rank: 7, team: 'Sliedrecht 2', played: 14, matchPoints: 18, boardPoints: '22,0' },
    { rank: 8, team: 'Dordrecht 2', played: 8, matchPoints: 14, boardPoints: '14,0' },
    { rank: 9, team: 'Giessen en Linge 6', played: 8, matchPoints: 13, boardPoints: '15,0' },
    { rank: 10, team: 'Giessen en Linge 5', played: 14, matchPoints: 12, boardPoints: '16,5' },
  ];
  ```

- [x] **Task 4.2: Create `src/pages/toernooien.astro` (`/toernooien/`)**
  Create `C:\git\pentachess-astro\src\pages\toernooien.astro` implementing:
  1. `<HeroSection />` with title `"Jeugdtoernooien & Competities"` and illustration `/images/redesign/hero-toernooien.png`.
  2. Section **"Evenementenkalender"** (vertical stack of white row-cards with colored location pill badge on the left, bold `Date - Event Name` in the middle, and blue pill CTA button `Inschrijven` on the right).
  3. Section **"Einduitslagen Viertallencompetitie"** (2-column split card: Visual Podium with 1st/2nd/3rd pedestals, trophy & chess pawns on the left; clean standings table `#`, `Team`, `Punten`, `Totaal` on the right).

  Write the following exact code to `C:\git\pentachess-astro\src\pages\toernooien.astro`:

  ```astro
  ---
  import BaseLayout from '../layouts/BaseLayout.astro';
  import HeroSection from '../components/HeroSection.astro';
  import Button from '../components/Button.astro';
  import { calendarEvents, viertallenStandings } from '../data/tournaments';
  ---

  <BaseLayout title="Jeugdtoernooien & Competities – Pentachess">
    <!-- 1. Hero Section -->
    <HeroSection
      title="Jeugdtoernooien & Competities"
      subtitle="Ontdek de magie van het schaakspel via onze regionale viertallencompetitie, snelschaaktoernooien en online teambattles."
      primaryCtaText="Bekijk Kalender"
      primaryCtaHref="#kalender"
      secondaryCtaText="Onze Schaaklessen"
      secondaryCtaHref="/schaakles/"
      imageSrc="/images/redesign/hero-toernooien.png"
      imageAlt="Kinderen vieren feest met een gouden trofee en schaakbord"
    />

    <!-- 2. Section: Evenementenkalender -->
    <section class="section" id="kalender">
      <div class="container-narrow">
        <h2 class="section-title">Evenementenkalender</h2>

        <div class="calendar-stack">
          {calendarEvents.map((ev) => (
            <div class="calendar-row">
              <div class="calendar-row-left">
                <span class={`event-badge badge-${ev.badgeColor}`}>{ev.badge}</span>
                <span class="event-title">
                  <strong>{ev.dateLabel} – {ev.title}</strong>
                </span>
              </div>
              <div class="calendar-row-right">
                <a
                  href={ev.href}
                  class="btn btn-secondary btn-sm"
                  {...(ev.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {ev.ctaLabel}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <!-- 3. Section: Einduitslagen Viertallencompetitie -->
    <section class="section" id="uitslagen" style="padding-top: 1rem;">
      <div class="container-narrow">
        <div class="surface-card results-card">
          <h2 class="results-heading">Einduitslagen Viertallencompetitie</h2>

          <div class="results-split">
            <!-- Left: Visual Podium -->
            <div class="podium-wrapper">
              <svg viewBox="0 0 320 250" width="300" height="235" xmlns="http://www.w3.org/2000/svg" aria-label="Podium 1e Giessen en Linge 1, 2e Sliedrecht 1, 3e Giessen en Linge 2">
                <!-- 2nd Place Green Pawn (Left) -->
                <circle cx="72" cy="92" r="14" fill="#4CAF50" stroke="#1A202C" stroke-width="3" />
                <path d="M56 145 C58 118 64 108 72 108 C80 108 86 118 88 145 Z" fill="#4CAF50" stroke="#1A202C" stroke-width="3" />
                <rect x="50" y="142" width="44" height="8" rx="4" fill="#3d9140" stroke="#1A202C" stroke-width="3" />

                <!-- 1st Place Gold Trophy (Center) -->
                <path d="M134 32 H186 V56 C186 74 172 86 160 86 C148 86 134 74 134 56 Z" fill="#F59E0B" stroke="#1A202C" stroke-width="3" />
                <path d="M134 40 H122 C122 56 128 62 136 62" fill="none" stroke="#1A202C" stroke-width="3" stroke-linecap="round" />
                <path d="M186 40 H198 C198 56 192 62 184 62" fill="none" stroke="#1A202C" stroke-width="3" stroke-linecap="round" />
                <polygon points="160,42 163,50 171,50 165,55 167,63 160,58 153,63 155,55 149,50 157,50" fill="#FEF3C7" stroke="#1A202C" stroke-width="1.5" />
                <rect x="154" y="86" width="12" height="14" fill="#D97706" stroke="#1A202C" stroke-width="3" />
                <rect x="140" y="100" width="40" height="10" rx="3" fill="#92400E" stroke="#1A202C" stroke-width="3" />

                <!-- 3rd Place Red/Coral Pawn (Right) -->
                <circle cx="248" cy="112" r="13" fill="#EF4444" stroke="#1A202C" stroke-width="3" />
                <path d="M234 162 C236 136 241 126 248 126 C255 126 260 136 262 162 Z" fill="#EF4444" stroke="#1A202C" stroke-width="3" />
                <rect x="228" y="159" width="40" height="8" rx="4" fill="#DC2626" stroke="#1A202C" stroke-width="3" />

                <!-- Pedestal 2 (Silver/Grey) -->
                <rect x="32" y="150" width="80" height="80" rx="6" fill="#94A3B8" stroke="#1A202C" stroke-width="3" />
                <text x="72" y="198" text-anchor="middle" fill="#FFFFFF" font-family="Nunito, sans-serif" font-weight="800" font-size="28">2</text>

                <!-- Pedestal 1 (Gold) -->
                <rect x="112" y="110" width="96" height="120" rx="6" fill="#FBBF24" stroke="#1A202C" stroke-width="3" />
                <circle cx="160" cy="168" r="22" fill="#F59E0B" stroke="#FFFFFF" stroke-width="2" />
                <text x="160" y="177" text-anchor="middle" fill="#FFFFFF" font-family="Nunito, sans-serif" font-weight="800" font-size="26">1</text>

                <!-- Pedestal 3 (Bronze/Light Grey) -->
                <rect x="208" y="167" width="80" height="63" rx="6" fill="#CBD5E1" stroke="#1A202C" stroke-width="3" />
                <text x="248" y="208" text-anchor="middle" fill="#FFFFFF" font-family="Nunito, sans-serif" font-weight="800" font-size="26">3</text>
              </svg>

              <div class="podium-legend">
                <div><strong>1e:</strong> Giessen en Linge 1 (36 pt)</div>
                <div><strong>2e:</strong> Sliedrecht 1 (34 pt)</div>
                <div><strong>3e:</strong> Giessen en Linge 2 (24 pt)</div>
              </div>
            </div>

            <!-- Right: Clean Standings Table -->
            <div class="standings-table-wrap">
              <table class="standings-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Team</th>
                    <th class="num-col">Punten</th>
                    <th class="num-col">Totaal</th>
                  </tr>
                </thead>
                <tbody>
                  {viertallenStandings.slice(0, 7).map((row) => (
                    <tr class={row.rank <= 3 ? 'is-top-three' : ''}>
                      <td class="rank-cell">{row.rank}</td>
                      <td class="team-cell">
                        <span class="mini-board-icon" aria-hidden="true">♟</span>
                        {row.team}
                      </td>
                      <td class="num-col">{row.boardPoints}</td>
                      <td class="num-col"><strong>{row.matchPoints}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div class="results-footer-link">
                <Button href="/nieuws/pentachess-viertallencompetitie-2025-2026-einduitslagen/" variant="outline-blue" size="sm" showArrow={true}>
                  Bekijk volledig verslag & alle 17 teams
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </BaseLayout>

  <style>
    .calendar-stack {
      background-color: var(--color-surface);
      border-radius: var(--radius-card);
      box-shadow: var(--shadow-card);
      overflow: hidden;
      divide-y: 1px solid var(--color-border);
    }

    .calendar-row {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      padding: 1.15rem 1.5rem;
      border-bottom: 1px solid var(--color-border);
      transition: background-color 0.15s ease;
    }

    .calendar-row:last-child {
      border-bottom: none;
    }

    .calendar-row:hover {
      background-color: #FAFCFA;
    }

    @media (min-width: 640px) {
      .calendar-row {
        flex-direction: row;
        align-items: center;
      }
    }

    .calendar-row-left {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
    }

    .event-badge {
      display: inline-block;
      min-width: 96px;
      text-align: center;
      padding: 0.35rem 0.9rem;
      border-radius: var(--radius-pill);
      color: #FFFFFF;
      font-weight: 700;
      font-size: 0.82rem;
    }

    .badge-green { background-color: var(--badge-green-bg); }
    .badge-blue { background-color: var(--badge-blue-bg); }
    .badge-orange { background-color: var(--badge-orange-bg); }
    .badge-pink { background-color: var(--badge-pink-bg); }
    .badge-purple { background-color: var(--badge-purple-bg); }

    .event-title {
      font-size: 1rem;
      color: var(--color-text-primary);
    }

    .results-card {
      padding: 2.5rem 2rem;
    }

    .results-heading {
      text-align: center;
      font-size: clamp(1.4rem, 2.5vw, 1.85rem);
      margin-bottom: 2rem;
    }

    .results-split {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2.5rem;
      align-items: center;
    }

    @media (min-width: 820px) {
      .results-split {
        grid-template-columns: 0.95fr 1.05fr;
      }
    }

    .podium-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .podium-legend {
      margin-top: 1rem;
      font-size: 0.9rem;
      color: var(--color-text-secondary);
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .standings-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.95rem;
    }

    .standings-table th {
      text-align: left;
      padding: 0.65rem 0.75rem;
      font-weight: 800;
      color: var(--color-text-secondary);
      border-bottom: 2px solid var(--color-border);
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .standings-table td {
      padding: 0.7rem 0.75rem;
      border-bottom: 1px solid var(--color-border);
      color: var(--color-text-primary);
    }

    .standings-table tr:nth-child(even) {
      background-color: var(--color-bg-soft);
    }

    .rank-cell {
      font-weight: 800;
      width: 36px;
    }

    .team-cell {
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .mini-board-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: 4px;
      background-color: var(--color-border);
      font-size: 0.8rem;
    }

    .num-col {
      text-align: right !important;
    }

    .results-footer-link {
      margin-top: 1.25rem;
      text-align: right;
    }
  </style>
  ```

---

## Phase 5: Schoolschaak, Schaakles & Secondary Pages Implementation

- [x] **Task 5.1: Update `src/pages/schoolschaak.astro` (`/schoolschaak/`)**
  Replace `C:\git\pentachess-astro\src\pages\schoolschaak.astro` to implement:
  1. `<HeroSection />` (`"Schaken op jouw school!"`, illustration `/images/redesign/hero-schoolschaak.png`).
  2. Section **"Informatief, Schoolschaak"** (`2`-column grid of white informational cards: *"Zelf aan de slag (online)"* and *"Begeleiding door een trainer"*, plus the existing YouTube video embed and trainers list so zero existing content is lost).
  3. Section **"Meld je school aan"** (High-contrast `#1E88E5` to `#4CAF50` split container with title, description, and `"Neem contact op"` button on the left; white embedded form card on the right with Email & School/Bericht inputs and green submit button).
  4. Section **"Ambassadeurs & Bekende Schakers"** (`<AmbassadorCards />`).

  Write the following exact code to `C:\git\pentachess-astro\src\pages\schoolschaak.astro`:

  ```astro
  ---
  import BaseLayout from '../layouts/BaseLayout.astro';
  import HeroSection from '../components/HeroSection.astro';
  import AmbassadorCards from '../components/AmbassadorCards.astro';
  import Button from '../components/Button.astro';

  const trainers = [
    {
      name: 'Tea Lanchava',
      role: 'Topschaakster & ChessQueen',
      area: 'Inzetbaar als trainer voor topschakers en scholen in Midden-Nederland, Vijfheerenlanden en Molenwaard.',
    },
    {
      name: 'Jorik Klein',
      role: 'Schoolschaak & Online Trainer',
      area: 'Inzetbaar voor beginners en online schaaklessen.',
    },
    {
      name: 'Ruud Neumeijer',
      role: 'Schoolschaaktrainer',
      area: 'Inzetbaar voor schoolschaak in de regio Rotterdam.',
    },
    {
      name: 'Herbert Eppinga',
      role: 'Secretaris & Clinictrainer',
      area: 'Inzetbaar voor schoolschaakclinics in de regio Vijfheerenlanden.',
    },
    {
      name: 'Kees van Wijk',
      role: 'Schoolschaaktrainer',
      area: 'Inzetbaar voor schoolschaak in Meerkerk.',
    },
  ];
  ---

  <BaseLayout title="Schoolschaak – Schaken op jouw school! – Pentachess">
    <!-- 1. Hero Section -->
    <HeroSection
      title="Schaken op jouw school!"
      subtitle="Wij weten dat schaken geweldig is voor de ontwikkeling van ieder kind: sociale vaardigheden, onder tijdsdruk beslissen, tegen je verlies kunnen, maar vooral heel veel plezier!"
      primaryCtaText="Meld je school aan"
      primaryCtaHref="#aanmelden"
      secondaryCtaText="Onze Schaaklessen"
      secondaryCtaHref="/schaakles/"
      imageSrc="/images/redesign/hero-schoolschaak.png"
      imageAlt="Leraar geeft schaakles op het demonstratiebord in een klaslokaal"
    />

    <!-- 2. Section: Informatief, Schoolschaak (2-column Grid) -->
    <section class="section">
      <div class="container-narrow">
        <h2 class="section-title">Informatief, Schoolschaak</h2>

        <div class="info-cards-grid">
          <article class="surface-card info-card">
            <h3>Zelf aan de slag (online)</h3>
            <p>
              De basisschool gaat zelf aan de slag met het online programma <strong>Chessity</strong> (vergelijkbaar met reken- en taalprogramma’s op school). Wij helpen de juf of meester met het kiezen van de juiste schaakspelletjes op echte schaakborden én met het leerlingvolgsysteem van Chessity.
            </p>
            <p class="info-highlight">
              Inclusief gratis kennismakingsclinic aan het begin van het schooljaar voor groep 4 t/m 8!
            </p>
          </article>

          <article class="surface-card info-card">
            <h3>Begeleiding door een trainer</h3>
            <p>
              De basisschool schakelt een gecertificeerde Pentachess-schaakdocent (met VOG) in om wekelijks een uurtje schaakles te geven in de klas (met digibord) of online. Tijdens de lessen worden veel spelletjes en puzzels gespeeld, aangevuld met Chessity zodat kinderen ook thuis kunnen oefenen.
            </p>
            <p class="info-highlight">
              In januari/februari/maart verzorgen wij bovendien de aansluiting naar het regionale schoolschaaktoernooi!
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- 3. Section: Meld je school aan (Split CTA & Form Container) -->
    <section class="section" id="aanmelden" style="padding-top: 0.5rem;">
      <div class="container-narrow">
        <div class="cta-banner-split">
          <div class="cta-banner-left">
            <h2>Meld je school aan</h2>
            <p>
              Laagdrempelig starten met schaken op school? Vraag vrijblijvend een gratis proefclinic (groep 4 t/m 8) of een offerte op maat aan voor jouw basisschool.
            </p>
            <Button href="mailto:pentachess@gmail.com?subject=Aanmelding%20Schoolschaak" variant="primary" showArrow={true}>
              Neem contact op
            </Button>
          </div>

          <div class="cta-form-card">
            <form
              action="mailto:pentachess@gmail.com"
              method="get"
              enctype="text/plain"
              class="school-form"
            >
              <div class="form-group">
                <label for="school-email" class="screen-reader-text">E-mailadres</label>
                <input
                  type="email"
                  id="school-email"
                  name="body"
                  placeholder="E-mailadres van school / contactpersoon"
                  required
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label for="school-name" class="screen-reader-text">Naam basisschool en vraag</label>
                <textarea
                  id="school-name"
                  name="subject"
                  rows="3"
                  placeholder="Naam van de school, plaats en jullie wens (bijv. gratis clinic of trainer)"
                  required
                  class="form-input form-textarea"
                ></textarea>
              </div>
              <button type="submit" class="btn btn-primary form-submit">
                Neem contact op
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Section: Video & Onze Schoolschaaktrainers -->
    <section class="section section-alt">
      <div class="container-narrow">
        <h2 class="section-title">Bekijk hoe schoolschaak werkt</h2>
        <div class="video-embed-wrapper" style="margin-bottom: 3.5rem;">
          <iframe
            loading="lazy"
            title="Wil jij leren aan de slag met schaken op de basisschool?"
            width="580"
            height="326"
            src="https://www.youtube.com/embed/oaEyEfAZUNQ?feature=oembed"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>

        <h2 class="section-title">Onze Schoolschaaktrainers</h2>
        <div class="trainers-grid">
          {trainers.map((t) => (
            <div class="surface-card trainer-card">
              <h3>{t.name}</h3>
              <p class="trainer-role">{t.role}</p>
              <p class="trainer-area">{t.area}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <!-- 5. Section: Ambassadeurs -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">Bekende Schakers & Ambassadeurs</h2>
        <AmbassadorCards />
      </div>
    </section>
  </BaseLayout>

  <style>
    .info-cards-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    @media (min-width: 720px) {
      .info-cards-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .info-card h3 {
      font-size: 1.3rem;
      margin-bottom: 0.75rem;
      color: var(--color-text-primary);
    }

    .info-highlight {
      margin-top: 1rem;
      margin-bottom: 0;
      padding: 0.75rem 1rem;
      background-color: var(--color-bg-soft);
      border-left: 4px solid var(--color-primary-green);
      border-radius: 0 var(--radius-md) var(--radius-md) 0;
      font-weight: 600;
      font-size: 0.92rem;
      color: var(--color-text-primary);
    }

    .cta-banner-split {
      background: linear-gradient(125deg, #1E88E5 0%, #1E88E5 52%, #4CAF50 100%);
      border-radius: var(--radius-card);
      padding: 2.5rem 2rem;
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
      align-items: center;
      box-shadow: var(--shadow-card-hover);
    }

    @media (min-width: 800px) {
      .cta-banner-split {
        grid-template-columns: 1.05fr 0.95fr;
        padding: 3rem;
      }
    }

    .cta-banner-left h2 {
      color: #FFFFFF;
      font-size: clamp(1.6rem, 2.8vw, 2.1rem);
      margin-bottom: 0.75rem;
    }

    .cta-banner-left p {
      color: rgba(255, 255, 255, 0.92);
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .cta-form-card {
      background-color: var(--color-surface);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
    }

    .school-form {
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
    }

    .form-input {
      width: 100%;
      padding: 0.8rem 1rem;
      border: 1px solid var(--color-border);
      border-radius: 10px;
      background-color: #F8FAFC;
      font-family: var(--font-sans);
      font-size: 0.95rem;
      color: var(--color-text-primary);
      transition: border-color 0.2s ease, background-color 0.2s ease;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--color-primary-blue);
      background-color: #FFFFFF;
    }

    .form-textarea {
      resize: vertical;
    }

    .form-submit {
      width: 100%;
    }

    .trainers-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @media (min-width: 640px) {
      .trainers-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .trainer-card h3 {
      font-size: 1.15rem;
      margin-bottom: 0.2rem;
    }

    .trainer-role {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--color-primary-green);
      margin-bottom: 0.5rem;
    }

    .trainer-area {
      font-size: 0.92rem;
      margin: 0;
    }
  </style>
  ```

- [x] **Task 5.2: Create `src/pages/schaakles.astro` (`/schaakles/`)**
  Create `C:\git\pentachess-astro\src\pages\schaakles.astro` so the `Schaakles` navigation link and `"Onze Schaaklessen"` Hero CTA button resolve to a dedicated, brand-consistent page:

  ```astro
  ---
  import BaseLayout from '../layouts/BaseLayout.astro';
  import HeroSection from '../components/HeroSection.astro';
  import Button from '../components/Button.astro';
  ---

  <BaseLayout title="Schaakles & Trainingen – Pentachess">
    <HeroSection
      title="Schaakles voor elk niveau!"
      subtitle="Voor gemotiveerde jeugdschakers én aankomende trainers biedt Stichting Pentachess online trainingen, stertrainingen en KNSB-erkende trainerscursussen."
      primaryCtaText="Meld je aan voor les"
      primaryCtaHref="mailto:pentachess@gmail.com?subject=Aanmelding%20Schaakles"
      secondaryCtaText="Schoolschaak"
      secondaryCtaHref="/schoolschaak/"
      imageSrc="/images/redesign/hero-schoolschaak.png"
      imageAlt="Schaaktrainer geeft les aan jeugdspelers"
    />

    <section class="section">
      <div class="container-narrow">
        <h2 class="section-title">Ons Trainingsaanbod</h2>
        <div class="programs-grid">
          <article class="surface-card">
            <h3>Jeugd- & Stertraining</h3>
            <p>
              Voor gemotiveerde jeugdschakers vanuit de aangesloten verenigingen of daarbuiten verzorgt Pentachess uitdagende trainingen, waaronder Stertraining door WGM Anne Haast en online teambattles op Lichess.
            </p>
            <Button href="mailto:pentachess@gmail.com?subject=Interesse%20Jeugdtraining" variant="secondary" size="sm" showArrow={true}>
              Informeer naar tijden
            </Button>
          </article>

          <article class="surface-card">
            <h3>Opleiding tot Schaaktrainer</h3>
            <p>
              Schakers en leerkrachten uit de regio worden door Pentachess opgeleid om zelfstandig schaaktraining te geven op scholen en clubs, ondersteund door onze jaarlijkse Pentachess Trainerscongres-dagen en Chessity.
            </p>
            <Button href="/nieuws/" variant="outline-blue" size="sm" showArrow={true}>
              Lees over onze trainerscursussen
            </Button>
          </article>
        </div>
      </div>
    </section>
  </BaseLayout>

  <style>
    .programs-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    @media (min-width: 720px) {
      .programs-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  </style>
  ```

- [x] **Task 5.3: Update `src/pages/info.astro` (`Over Ons` / `/info/`)**
  Update `C:\git\pentachess-astro\src\pages\info.astro` so the "Over Ons" page uses `<HeroSection />` and clean surface cards while preserving 100% of `pagesData['info'].content` (Google Maps iframe, RSIN `8602.39.160`, Statutaire doelstelling, Hoofdlijnen beleid, and the 5 board members with club logos):

  ```astro
  ---
  import BaseLayout from '../layouts/BaseLayout.astro';
  import HeroSection from '../components/HeroSection.astro';
  import pagesData from '../data/pages.json';

  const infoPage = pagesData['info'];
  ---

  <BaseLayout title="Over Ons & Info – Pentachess">
    <HeroSection
      title="Over Stichting Pentachess"
      subtitle="Vijf schaakverenigingen in de Merwede- en Vijfheerenlanden-regio slaan de handen ineen om schaken dicht bij ieder kind te brengen."
      primaryCtaText="Bekijk Toernooien"
      primaryCtaHref="/toernooien/"
      secondaryCtaText="Schoolschaak"
      secondaryCtaHref="/schoolschaak/"
      imageSrc="/images/redesign/hero-home.png"
      imageAlt="Over Stichting Pentachess"
    />

    <section class="section">
      <div class="container-narrow">
        <article class="surface-card">
          <div class="entry-content" set:html={infoPage.content} />
        </article>
      </div>
    </section>
  </BaseLayout>
  ```

- [x] **Task 5.4: Update `src/components/PostArticle.astro`, `src/components/Pagination.astro`, and `/nieuws/` Pages**
  1. Replace `C:\git\pentachess-astro\src\components\PostArticle.astro` with a clean surface-card layout that preserves all post metadata, author links (`/author/${post.data.authorSlug}/`), Dutch formatted dates, Markdown content rendering, and single-post previous/next navigation:

  ```astro
  ---
  import type { CollectionEntry } from 'astro:content';

  interface Props {
    post: CollectionEntry<'posts'>;
    isSingle?: boolean;
    prevPost?: CollectionEntry<'posts'> | null;
    nextPost?: CollectionEntry<'posts'> | null;
  }

  const { post, isSingle = false, prevPost, nextPost } = Astro.props;
  const { Content } = await post.render();

  function formatDutchDate(date: Date) {
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  const postId = post.data.id ? `post-${post.data.id}` : `post-${post.slug}`;
  ---

  <article class="surface-card post-article" id={postId}>
    <header class="post-article-header">
      <div class="post-meta-pills">
        <span class="meta-pill">
          Door <a href={`/author/${post.data.authorSlug}/`}>{post.data.author}</a>
        </span>
        <time datetime={post.data.date.toISOString()} class="meta-date">
          {formatDutchDate(post.data.date)}
        </time>
      </div>

      {isSingle ? (
        <h1 class="post-article-title">{post.data.title}</h1>
      ) : (
        <h2 class="post-article-title">
          <a href={`/nieuws/${post.slug}/`}>{post.data.title}</a>
        </h2>
      )}
    </header>

    <div class="entry-content">
      <Content />
    </div>

    {isSingle && (prevPost || nextPost) && (
      <nav class="post-nav" aria-label="Berichtnavigatie">
        {prevPost ? (
          <a class="btn btn-outline-blue btn-sm" href={`/nieuws/${prevPost.slug}/`}>
            &larr; {prevPost.data.title}
          </a>
        ) : <span />}
        {nextPost && (
          <a class="btn btn-outline-blue btn-sm" href={`/nieuws/${nextPost.slug}/`}>
            {nextPost.data.title} &rarr;
          </a>
        )}
      </nav>
    )}
  </article>

  <style>
    .post-article {
      margin-bottom: 2rem;
    }

    .post-article-header {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--color-border);
    }

    .post-meta-pills {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.65rem;
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }

    .meta-pill {
      background-color: var(--color-bg-soft);
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-pill);
      font-weight: 600;
    }

    .post-article-title {
      font-size: clamp(1.4rem, 2.5vw, 2rem);
      margin: 0;
    }

    .post-article-title a {
      color: var(--color-text-primary);
    }

    .post-article-title a:hover {
      color: var(--color-primary-blue);
    }

    .post-nav {
      margin-top: 2.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--color-border);
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 1rem;
    }
  </style>
  ```

  2. Update `C:\git\pentachess-astro\src\components\Pagination.astro` to style page numbers as clean pill buttons:

  ```astro
  ---
  interface Props {
    currentPage: number;
    totalPages: number;
    baseUrl?: string;
  }

  const { currentPage, totalPages, baseUrl = '/nieuws/' } = Astro.props;

  function getPageUrl(p: number) {
    if (p === 1) return baseUrl;
    const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    return `${base}page/${p}/`;
  }

  const pages: (number | 'dots')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== 'dots') {
      pages.push('dots');
    }
  }
  ---

  {totalPages > 1 && (
    <nav class="pagination-nav" aria-label="Berichten paginering">
      {currentPage > 1 && (
        <a class="btn btn-outline-blue btn-sm" href={getPageUrl(currentPage - 1)}>
          &larr; Nieuwere
        </a>
      )}

      <div class="pagination-numbers">
        {pages.map((p) => {
          if (p === 'dots') return <span class="page-dots">&hellip;</span>;
          if (p === currentPage) {
            return <span aria-current="page" class="page-pill is-current">{p}</span>;
          }
          return <a class="page-pill" href={getPageUrl(p)}>{p}</a>;
        })}
      </div>

      {currentPage < totalPages && (
        <a class="btn btn-outline-blue btn-sm" href={getPageUrl(currentPage + 1)}>
          Oudere &rarr;
        </a>
      )}
    </nav>
  )}

  <style>
    .pagination-nav {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin: 2.5rem 0;
    }

    .pagination-numbers {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .page-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      font-weight: 700;
      font-size: 0.92rem;
      color: var(--color-text-primary);
      background-color: var(--color-surface);
      box-shadow: var(--shadow-card);
      text-decoration: none;
    }

    .page-pill:hover {
      background-color: var(--color-primary-blue-light);
      color: var(--color-primary-blue);
    }

    .page-pill.is-current {
      background-color: var(--color-primary-green);
      color: #FFFFFF;
    }

    .page-dots {
      padding: 0 0.4rem;
      color: var(--color-text-secondary);
    }
  </style>
  ```

  3. Wrap the content inside `src/pages/nieuws/index.astro`, `src/pages/nieuws/page/[page].astro`, `src/pages/nieuws/[slug].astro`, and `src/pages/author/[author].astro` in `<div class="section"><div class="container-narrow">...</div></div>` so all news and author pages align cleanly with the new container layout.

---

## Phase 6: Verification & Responsiveness Checklist

Execute each verification step below and fix any issues before concluding:

- [x] **Task 6.1: Verify Cropped Hero Assets Exist**
  Run:
  ```powershell
  Get-ChildItem public/images/redesign/*.png | Select-Object Name, Length
  ```
  Confirm `hero-home.png`, `hero-toernooien.png`, and `hero-schoolschaak.png` all exist and have `Length > 0`.

- [x] **Task 6.2: Run Production Build (`npm run build`)**
  Run:
  ```powershell
  npm run build
  ```
  Verify that Astro compiles with **0 errors** and generates static HTML files in `dist/` for:
  - `/` (`dist/index.html`)
  - `/toernooien/` (`dist/toernooien/index.html`)
  - `/schoolschaak/` (`dist/schoolschaak/index.html`)
  - `/schaakles/` (`dist/schaakles/index.html`)
  - `/info/` (`dist/info/index.html`)
  - `/nieuws/`, `/nieuws/page/2/`..`/5/`, all 50 `/nieuws/<slug>/` routes, and `/author/<slug>/`.

- [x] **Task 6.3: Visual & Responsive Verification Checklist**
  - **Brand Colors & Typography:** Confirm `Nunito` Google Font loads and CSS variables (`--color-primary-green: #4CAF50`, `--color-primary-blue: #1E88E5`, `--color-bg-soft: #F4F9F4`, `--color-surface: #FFFFFF`) are applied globally.
  - **Desktop & Mobile Navbar:** Verify the active link state highlights in `#4CAF50`, the `Doe mee!` pill button renders on desktop, and the mobile hamburger button toggles `#mobile-menu-drawer` below `960px`.
  - **Homepage (`/`)**: Verify 2-column wave hero, 3-column `Aandachtsgebieden` cards with custom SVG icons, 3-column `Laatste Nieuws` cards with extracted thumbnails, `Ambassadeurs` cards, and `Partners en sponsors`.
  - **Toernooien (`/toernooien/`)**: Verify `Evenementenkalender` rows with colored pill badges (`Green`, `Blue`, `Orange`, `Pink`, `Purple`) and `Einduitslagen Viertallencompetitie` split card with SVG Podium + Standings Table.
  - **Schoolschaak (`/schoolschaak/`)**: Verify 2-column info cards, high-contrast `Meld je school aan` split CTA form card, YouTube embed, trainers grid, and Ambassador profile cards.
