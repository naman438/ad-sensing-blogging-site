# AdSense Setup Guide — SucceedStack

## Current Status

| Step | Status |
|---|---|
| AdSense account created | ✅ Done |
| Site added (`succeedstack.com`) | ✅ Done |
| Site ownership verified (ads.txt) | ✅ Done |
| Review requested | ✅ Done |
| Payment info ("Tell us about you") | ⏳ Pending |
| Site approved by Google | ⏳ Waiting (2-4 weeks) |
| Real ad slot IDs added to code | ⏳ After approval |

---

## Publisher ID

```
ca-pub-6706180903457586
```

---

## After AdSense Approval

When Google emails you with approval, follow these steps:

### Step 1: Create Ad Units in AdSense

1. Go to [adsense.google.com](https://adsense.google.com)
2. Click **Ads** in the left sidebar
3. Click **By ad unit** tab
4. Click **Create new ad unit**
5. Create the following ad units:

| Ad Unit Name | Format | Size |
|---|---|---|
| Home Banner | Display | Horizontal (728×90 or responsive) |
| Home Rectangle | Display | Rectangle (300×250) |
| Article Rectangle | Display | Rectangle (300×250) |
| Article Footer Banner | Display | Horizontal (728×90 or responsive) |
| Article Sidebar | Display | Vertical (160×600 or responsive) |
| Blog Banner | Display | Horizontal (728×90 or responsive) |
| Category Banner | Display | Horizontal (728×90 or responsive) |

6. For each ad unit, copy the **slot ID** (a 10-digit number like `1234567890`)

### Step 2: Replace Placeholder Slot IDs in Code

Update the slot IDs in these files:

**`src/app/page.tsx`** (Home page)
```tsx
<AdUnit slot="YOUR_HOME_BANNER_SLOT" format="horizontal" ... />
<AdUnit slot="YOUR_HOME_RECTANGLE_SLOT" format="rectangle" ... />
```

**`src/app/blog/[slug]/page.tsx`** (Article page)
```tsx
<AdUnit slot="YOUR_ARTICLE_RECTANGLE_SLOT" format="rectangle" ... />
<AdUnit slot="YOUR_ARTICLE_FOOTER_SLOT" format="horizontal" ... />
<AdUnit slot="YOUR_ARTICLE_SIDEBAR_SLOT" format="vertical" ... />
```

**`src/app/blog/page.tsx`** (Blog listing)
```tsx
<AdUnit slot="YOUR_BLOG_BANNER_SLOT" format="horizontal" ... />
```

**`src/app/category/[category]/page.tsx`** (Category page)
```tsx
<AdUnit slot="YOUR_CATEGORY_BANNER_SLOT" format="horizontal" ... />
```

### Step 3: Commit and Push

```bash
git add -A
git commit -m "feat: add real AdSense ad slot IDs"
git push
```

Vercel will auto-deploy within 2 minutes. Ads will start showing on the site.

---

## Revenue Expectations

### By Traffic Level

| Monthly Visitors | Est. Monthly Revenue |
|---|---|
| 1,000 | $1 – $5 |
| 5,000 | $5 – $25 |
| 10,000 | $10 – $50 |
| 50,000 | $50 – $250 |
| 100,000 | $100 – $500 |

### By Category (CPC varies)

| Category | Avg CPC Range |
|---|---|
| Finance | $0.50 – $3.00 |
| Crypto | $0.30 – $2.00 |
| Technology | $0.20 – $1.50 |
| AI & LLMs | $0.20 – $1.00 |
| Productivity | $0.10 – $0.50 |

Finance and crypto topics tend to have the highest advertiser bids.

---

## Payment Setup

1. Go to AdSense → **Payments** → **Enter information**
2. Fill in:
   - Full legal name
   - Address (for tax purposes)
   - Phone number
3. Payment threshold: Google pays out when balance reaches **$100**
4. Payment method: Bank transfer (add bank details in Payments settings)

---

## AdSense Policies to Follow

To keep your account in good standing:
- Never click your own ads
- Never ask others to click your ads
- Do not use bots or traffic exchange services
- Keep content original and useful (AI-generated is allowed if it provides value)
- Maintain a privacy policy page (already at `/privacy`)
