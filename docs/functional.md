# Functional Documentation — SucceedStack

## Purpose

SucceedStack is an AI-powered blog that automatically publishes articles on five topic categories twice daily. The site earns revenue through Google AdSense display advertising.

---

## Categories

| Category | Slug | Topics |
|---|---|---|
| AI & LLMs | `llm` | Large language models, generative AI, machine learning |
| Finance | `finance` | Personal finance, investing, markets, economics |
| Technology | `tech` | Software, hardware, startups, tech industry |
| Crypto & Web3 | `crypto` | Blockchain, DeFi, NFTs, digital assets |
| Productivity | `productivity` | Tools, habits, strategies for getting more done |

Each category has 50 unique pre-defined topics. Topics are consumed in random order and never repeated until all 50 are exhausted, then the category resets automatically.

---

## Site Pages

### Home Page (`/`)

- Hero section with the latest featured article
- Category filter tabs (All, AI & LLMs, Finance, Technology, Crypto & Web3, Productivity)
- Recent Articles grid (latest posts across all categories)
- 2 ad units (horizontal banner above fold, rectangle mid-page)

### Blog Listing (`/blog`)

- Paginated list of all published posts
- 1 ad unit (horizontal banner)

### Article Page (`/blog/[slug]`)

- Full article with markdown rendered as HTML
- Author info, reading time, publish date, category tag
- Related articles section
- 3 ad units (rectangle mid-article, horizontal banner post-article, vertical sidebar)

### Category Page (`/category/[slug]`)

- All articles for a specific category
- 1 ad unit (horizontal banner)

### Other Pages

- `/privacy` — Privacy policy
- `/disclaimer` — Content disclaimer
- `/sitemap.xml` — Auto-generated XML sitemap
- `/robots.txt` — Search engine crawl rules
- `/ads.txt` — Google AdSense verification file

---

## Content Generation

### How It Works

1. GitHub Actions triggers the generation script at **8:00 AM UTC** and **4:00 PM UTC** every day
2. The script picks a random category (or a specified one) and selects an unused topic from that category
3. Two Groq API calls are made:
   - **Call 1**: Generate an SEO-optimized article title for the topic
   - **Call 2**: Write a full 900-1200 word article with proper structure
4. The article is saved as a markdown file in `content/posts/`
5. The topic is marked as used in `content/used-topics.json`
6. GitHub Actions commits the new file to the repository
7. Vercel detects the commit and automatically redeploys the site within 1-2 minutes

### Manual Generation

You can also generate posts manually from the terminal:

```bash
# Generate 1 post in a random category
npm run generate

# Generate 1 post in a specific category
npm run generate:llm
npm run generate:finance
npm run generate:tech

# Generate multiple posts
node scripts/generate.mjs finance 3   # 3 finance posts
node scripts/generate.mjs llm 5       # 5 LLM posts
```

### Topic Rotation

- 50 topics × 5 categories = **250 unique topics total**
- At 2 posts/day, it takes ~**125 days** before any topic repeats
- When a category's 50 topics are all used, the tracker resets and all 50 become available again

---

## Monetization

### Google AdSense

The site displays Google AdSense ads on all pages. Revenue comes from two sources:

**Impressions (CPM)**
- Earned per 1,000 page views
- Typical rate: $0.50–$3.00 per 1,000 views
- No user action required

**Clicks (CPC)**
- Earned when a visitor clicks an ad
- Typical rate: $0.10–$2.00 per click
- Varies widely by niche (finance and crypto pay more)

### AdSense Status

- Publisher ID: `ca-pub-6706180903457586`
- Site submitted for review — approval expected within 2-4 weeks
- After approval, real ad slot IDs must be added to replace the placeholder IDs in the code

---

## SEO Strategy

### Automatic SEO Features

- Every article gets a unique `<title>`, meta description, canonical URL, and OpenGraph tags
- JSON-LD structured data (Article schema) helps Google understand content type
- Sitemap at `/sitemap.xml` submitted to Google Search Console
- `robots.txt` allows all crawlers

### Content SEO

- Articles are generated with SEO requirements baked into the prompt:
  - 4-6 keyword-rich H2 headers
  - 900-1200 word length (optimal for ranking)
  - Natural keyword placement in introduction
  - Specific examples and actionable content
  - Tags/keywords extracted by the AI and stored in frontmatter

### Google Search Console

- Domain verified and sitemap submitted
- 38 pages discovered on first crawl (14 June 2026)
- Pages should begin appearing in search results within 1-2 weeks

---

## User Experience

### Navigation

- Top navigation: Logo + 5 category links
- Category filter tabs on the home page
- Breadcrumbs on article pages
- Related articles at the bottom of each post

### Reading Experience

- Reading time displayed on every post
- Estimated from word count (avg 200 words/minute)
- Responsive layout — works on mobile, tablet, desktop

---

## Content Policies

- All content is AI-generated using the Groq API (`llama-3.3-70b-versatile` model)
- A disclaimer page at `/disclaimer` informs readers that content is AI-generated
- Content covers general educational topics only — not personalized financial or legal advice
- The site complies with Google AdSense programme policies
