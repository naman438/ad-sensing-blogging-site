#!/usr/bin/env node
/**
 * One-time script to add Pexels image URLs to all existing articles.
 * Usage: node scripts/add-images.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.join(__dirname, '..', 'content', 'posts');

const CATEGORY_KEYWORDS = {
  finance:      'finance investing money stock market',
  llm:          'artificial intelligence technology data science',
  tech:         'technology software coding computer',
  crypto:       'cryptocurrency blockchain digital currency bitcoin',
  productivity: 'productivity workspace office focus work',
};

async function fetchPexelsImage(query) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) throw new Error('PEXELS_API_KEY not set in .env.local');
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&orientation=landscape`,
      { headers: { Authorization: apiKey } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const photos = data.photos ?? [];
    if (photos.length === 0) return null;
    const photo = photos[Math.floor(Math.random() * photos.length)];
    return photo.src.large2x ?? photo.src.large ?? photo.src.medium ?? null;
  } catch {
    return null;
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  let updated = 0;
  let skipped = 0;

  for (const file of files) {
    const filepath = path.join(POSTS_DIR, file);
    const raw = fs.readFileSync(filepath, 'utf-8');

    // Skip if already has image_url
    if (raw.includes('image_url:')) {
      skipped++;
      continue;
    }

    // Extract title and category from frontmatter
    const titleMatch = raw.match(/^title:\s*"?(.+?)"?\s*$/m);
    const categoryMatch = raw.match(/^category:\s*"?(.+?)"?\s*$/m);
    const title = titleMatch?.[1]?.replace(/\\"/g, '"') ?? '';
    const category = categoryMatch?.[1] ?? '';

    if (!title) { skipped++; continue; }

    const keywords = `${title} ${CATEGORY_KEYWORDS[category] ?? category}`;
    process.stdout.write(`[${updated + skipped + 1}/${files.length}] "${title.slice(0, 50)}"... `);

    const imageUrl = await fetchPexelsImage(keywords);

    if (imageUrl) {
      // Insert image_url before "published: true"
      const updated_content = raw.replace(
        /^(published:\s*true)$/m,
        `image_url: "${imageUrl}"\npublished: true`
      );
      fs.writeFileSync(filepath, updated_content, 'utf-8');
      console.log('✓');
      updated++;
    } else {
      console.log('✗ no image');
      skipped++;
    }

    // Small delay to avoid hammering the API
    await sleep(200);
  }

  console.log(`\nDone! ${updated} articles updated, ${skipped} skipped.`);
}

main().catch(err => { console.error(err.message); process.exit(1); });
