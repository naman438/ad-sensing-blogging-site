# Technical Documentation — SucceedStack

## Overview

SucceedStack is a server-rendered blog platform built with Next.js 16 App Router. It uses a file-based CMS (markdown files) instead of a database. AI-generated posts are written to the filesystem by a standalone Node.js script and committed to GitHub, which triggers automatic Vercel redeployment.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| AI Generation | Groq API (`llama-3.3-70b-versatile`) |
| CMS | File-based (markdown + gray-matter) |
| Hosting | Vercel |
| CI/CD | GitHub Actions |
| Domain | Cloudflare (succeedstack.com) |
| Monetization | Google AdSense |

---

## Project Structure

```
ad-sensing/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout, AdSense script, JSON-LD schemas
│   │   ├── page.tsx                # Home page
│   │   ├── blog/
│   │   │   ├── page.tsx            # Blog listing page
│   │   │   └── [slug]/page.tsx     # Individual post page
│   │   ├── category/
│   │   │   └── [category]/page.tsx # Category listing page
│   │   ├── api/
│   │   │   └── generate-post/route.ts  # API route (unused in production)
│   │   ├── disclaimer/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── sitemap.ts              # Auto-generated sitemap.xml
│   │   └── robots.ts               # Auto-generated robots.txt
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── BlogCard.tsx
│   │   ├── AdUnit.tsx              # Google AdSense ad unit wrapper
│   │   └── JsonLd.tsx              # JSON-LD structured data injector
│   ├── lib/
│   │   ├── posts.ts                # File-based post reading logic
│   │   └── groq.ts                 # Groq client + post generation (used in API route)
│   └── types/
│       └── index.ts                # Post interface, CATEGORIES, CATEGORY_TOPICS
├── content/
│   ├── posts/                      # Markdown post files (YYYY-MM-DD-slug.md)
│   └── used-topics.json            # Topic tracker (prevents duplicate topics)
├── scripts/
│   └── generate.mjs                # Standalone post generation script
├── public/
│   └── ads.txt                     # Google AdSense ads.txt verification
├── .github/
│   └── workflows/
│       └── generate-posts.yml      # GitHub Actions cron workflow
└── docs/                           # Project documentation
```

---

## Key Modules

### `src/lib/posts.ts`

Reads markdown files from `content/posts/` using Node.js `fs` module. All functions are async.

| Function | Description |
|---|---|
| `getAllPosts(limit)` | Returns all published posts sorted newest-first |
| `getPostBySlug(slug)` | Returns a single post by its slug |
| `getPostsByCategory(category, limit)` | Returns posts filtered by category |
| `getRecentPosts(limit)` | Returns the N most recent posts |
| `getRelatedPosts(category, excludeSlug, limit)` | Returns related posts in same category |

Post filenames follow the pattern `YYYY-MM-DD-slug.md`. Files are sorted reverse-alphabetically so newest posts appear first.

### `src/types/index.ts`

Defines:
- `Post` interface — the data shape for all blog posts
- `CATEGORIES` — the 5 supported categories (llm, finance, tech, crypto, productivity)
- `CATEGORY_TOPICS` — 50 unique topics per category (250 total) used by the generation script

### `scripts/generate.mjs`

Standalone ES module script that:
1. Reads `content/used-topics.json` to find unused topics for the selected category
2. Calls Groq API twice — once for title, once for the full article
3. Parses the EXCERPT and TAGS from the article response
4. Writes a markdown file with YAML frontmatter to `content/posts/`
5. Updates `content/used-topics.json` to mark the topic as used

The topic tracker resets a category automatically when all 50 topics have been used.

### `src/app/layout.tsx`

Root layout that:
- Sets site-wide metadata (title, description, OpenGraph, Twitter card)
- Injects WebSite and Organization JSON-LD schemas
- Conditionally loads the AdSense script when `NEXT_PUBLIC_ADSENSE_CLIENT` is set to a real publisher ID

### `src/components/AdUnit.tsx`

Wraps an AdSense `<ins>` tag. Shows a grey placeholder box when `NEXT_PUBLIC_ADSENSE_CLIENT` is not configured. Calls `window.adsbygoogle.push({})` on component mount to trigger ad loading.

---

## Data Flow

```
GitHub Actions (cron 8am / 4pm UTC)
    └── node scripts/generate.mjs
        ├── Groq API → generates title + article
        ├── Writes content/posts/YYYY-MM-DD-slug.md
        └── Updates content/used-topics.json
            └── git commit + push → GitHub
                └── Vercel detects push → rebuilds + redeploys
                    └── Next.js reads content/posts/ → renders pages
```

---

## Post Frontmatter Schema

```yaml
---
title: "Post Title"
slug: "post-title-slug"
category: "llm"           # one of: llm, finance, tech, crypto, productivity
excerpt: "Meta description for SEO (140-160 chars)"
tags: ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"]
reading_time: 5           # estimated minutes to read
created_at: "2026-06-14T08:00:00.000Z"
updated_at: "2026-06-14T08:00:00.000Z"
published: true
---
```

---

## SEO Implementation

- **JSON-LD schemas**: Article, BreadcrumbList, WebSite, Organization, ItemList, CollectionPage
- **Sitemap**: Auto-generated at `/sitemap.xml` via `src/app/sitemap.ts`
- **Robots.txt**: Auto-generated at `/robots.txt` via `src/app/robots.ts`
- **Canonical URLs**: Set via `alternates.canonical` in `generateMetadata()`
- **OpenGraph + Twitter**: Configured in `generateMetadata()` per page
- **ISR**: Pages revalidate every 3600 seconds

---

## Environment Variables

| Variable | Used In | Description |
|---|---|---|
| `GROQ_API_KEY` | `scripts/generate.mjs`, `src/lib/groq.ts` | Groq API key for content generation |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | `src/app/layout.tsx`, `src/components/AdUnit.tsx` | AdSense publisher ID (`ca-pub-...`) |
| `NEXT_PUBLIC_SITE_URL` | Layout, sitemap, robots, all pages | Canonical site URL |
| `CRON_SECRET` | `src/app/api/generate-post/route.ts` | Secret for API route protection |

---

## Ad Placement

| Page | Ad Count | Formats |
|---|---|---|
| Home | 2 | Horizontal banner, Rectangle |
| Blog listing | 1 | Horizontal banner |
| Article page | 3 | Rectangle (mid), Horizontal (bottom), Vertical (sidebar) |
| Category page | 1 | Horizontal banner |

**Note:** Ad slot IDs in the code are placeholders. Replace them with real slot IDs from the AdSense dashboard after account approval.
