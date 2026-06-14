# Deployment Documentation — SucceedStack

## Infrastructure Overview

```
succeedstack.com (Cloudflare DNS)
    └── Vercel (hosting + CDN)
        └── GitHub repo: naman438/ad-sensing-blogging-site
            └── GitHub Actions (cron automation)
                └── Groq API (AI content generation)
```

---

## Services & Credentials

| Service | Account | Purpose |
|---|---|---|
| Vercel | naman438 / namankundra422@gmail.com | Hosting and deployment |
| GitHub | naman438 / namankundra422@gmail.com | Source code and Actions |
| Cloudflare | — | DNS for succeedstack.com |
| Groq | — | AI content generation API |
| Google AdSense | — | Ad monetization (pub-6706180903457586) |
| Google Search Console | — | SEO monitoring |

---

## Vercel Configuration

**Project name:** `ad-sensing-blogging-site`
**Production URL:** `https://succeedstack.com`
**Framework:** Next.js (auto-detected)
**Build command:** `npm run build`
**Output directory:** `.next`

### Environment Variables (set in Vercel dashboard)

| Variable | Value |
|---|---|
| `GROQ_API_KEY` | Set in Vercel dashboard — do not commit to repo |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | `ca-pub-6706180903457586` |
| `NEXT_PUBLIC_SITE_URL` | `https://succeedstack.com` |
| `CRON_SECRET` | `local-dev-secret` |

### Domains

| Domain | Status |
|---|---|
| `succeedstack.com` | Primary — Cloudflare A record → 76.76.21.21 |
| `www.succeedstack.com` | Redirect → succeedstack.com |
| `ad-sensing-blogging-site.vercel.app` | Original Vercel URL (still active) |

---

## DNS Configuration (Cloudflare)

| Type | Name | Value | Proxy |
|---|---|---|---|
| A | `@` | `76.76.21.21` | DNS only (grey cloud) |
| CNAME | `www` | `cname.vercel-dns.com` | DNS only (grey cloud) |
| TXT | `@` | Google Search Console verification record | DNS only |

**Important:** Proxy status must be **DNS only (grey cloud)**, NOT proxied (orange cloud), for Vercel to work correctly.

---

## GitHub Actions — Auto Post Generation

**Workflow file:** `.github/workflows/generate-posts.yml`

### Schedule

| Time (UTC) | Local Time (IST) |
|---|---|
| 08:00 UTC | 1:30 PM IST |
| 16:00 UTC | 9:30 PM IST |

### Workflow Steps

1. Checkout repository
2. Setup Node.js 24
3. Run `npm install`
4. Run `node scripts/generate.mjs` (uses `GROQ_API_KEY` secret)
5. Auto-commit new files: `content/posts/*.md` and `content/used-topics.json`

### Required GitHub Secret

Go to GitHub repo → Settings → Secrets and variables → Actions → New repository secret:

| Secret | Value |
|---|---|
| `GROQ_API_KEY` | Your Groq API key |

### Manual Trigger

You can manually trigger the workflow from:
GitHub repo → Actions → Generate Daily Posts → Run workflow

---

## Local Development Setup

### Prerequisites

- Node.js 18+
- A Groq API key

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/naman438/ad-sensing-blogging-site.git
cd ad-sensing-blogging-site

# 2. Install dependencies
npm install

# 3. Create .env.local
cp .env.local.example .env.local
# Add your GROQ_API_KEY to .env.local

# 4. Generate some posts (if content/posts is empty)
npm run generate

# 5. Start dev server
npm run dev
# Site available at http://localhost:3000
```

### Local Environment Variables (`.env.local`)

```env
GROQ_API_KEY=your_groq_api_key_here
CRON_SECRET=local-dev-secret
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Deployment Process

### Automatic (normal flow)

Every push to the `main` branch on GitHub triggers an automatic Vercel redeployment. This happens:
- When GitHub Actions commits a new post (twice daily)
- When you push code changes locally

### Manual Redeployment

1. Go to [vercel.com](https://vercel.com)
2. Select the `ad-sensing-blogging-site` project
3. Go to **Deployments** tab
4. Click the 3 dots (⋯) on the latest deployment
5. Click **Redeploy**

### After Changing Environment Variables

Environment variable changes in Vercel do NOT take effect until a redeployment. Always redeploy after changing env vars.

---

## Post-Deployment Checklist

After any major deployment, verify:

- [ ] `https://succeedstack.com` loads correctly
- [ ] `https://succeedstack.com/sitemap.xml` returns valid XML
- [ ] `https://succeedstack.com/robots.txt` returns correct rules
- [ ] `https://succeedstack.com/ads.txt` returns the AdSense verification line
- [ ] At least one blog post is visible on the home page
- [ ] Category pages load correctly

---

## Monitoring

### GitHub Actions

Monitor automated post generation at:
GitHub repo → Actions → Generate Daily Posts

Check for failed runs — a red ✗ means a post was not generated.

### Google Search Console

Monitor search indexing and performance at:
[search.google.com/search-console](https://search.google.com/search-console) → succeedstack.com

Key metrics to watch:
- Total clicks and impressions
- Pages indexed vs submitted in sitemap
- Core Web Vitals

### Vercel Analytics

Basic traffic analytics available in Vercel dashboard under **Analytics** tab.

---

## Troubleshooting

### Posts not appearing after GitHub Actions runs

1. Check the Actions run log for errors
2. Verify `GROQ_API_KEY` secret is set in GitHub
3. Check that files were committed to `content/posts/`

### Site shows old content after a push

Vercel deployments take 1-2 minutes. Wait and refresh. If still stale, manually redeploy.

### AdSense ads not showing

1. Confirm `NEXT_PUBLIC_ADSENSE_CLIENT` is set to the real publisher ID (not the placeholder)
2. Confirm Vercel was redeployed after setting the env var
3. Confirm AdSense has approved the site
4. Replace placeholder ad slot IDs with real slot IDs from AdSense dashboard

### Sitemap shows "Couldn't fetch" in Search Console

This is usually temporary. Google retries automatically within 24-48 hours. If it persists, visit `https://succeedstack.com/sitemap.xml` directly to confirm it returns valid XML.

---

## Pending Tasks

- [ ] Complete AdSense "Tell us about you" (payment info) on AdSense home page
- [ ] Wait for AdSense site approval (2-4 weeks)
- [ ] After approval: create real ad units in AdSense dashboard
- [ ] After approval: replace placeholder ad slot IDs in `src/app/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/app/blog/page.tsx`, and `src/app/category/[category]/page.tsx`
