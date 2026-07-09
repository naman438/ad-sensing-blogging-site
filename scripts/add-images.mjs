#!/usr/bin/env node
/**
 * One-time script to add Pexels image URLs to all existing articles.
 * Pass --dedup to only fix articles with duplicate image URLs.
 * Usage: node scripts/add-images.mjs [--dedup]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = path.join(__dirname, '..', 'content', 'posts');
const DEDUP_MODE = process.argv.includes('--dedup');

const CATEGORY_KEYWORDS = {
  finance:      'finance investing money stock market',
  llm:          'artificial intelligence technology data science',
  tech:         'technology software coding computer',
  crypto:       'cryptocurrency blockchain digital currency bitcoin',
  productivity: 'productivity workspace office focus work',
};

async function fetchPexelsImage(query, usedUrls, page = 1) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) throw new Error('PEXELS_API_KEY not set in .env.local');
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=30&page=${page}&orientation=landscape`,
      { headers: { Authorization: apiKey } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const photos = data.photos ?? [];
    if (photos.length === 0) return null;

    // Shuffle and pick the first one not already used
    const shuffled = photos.sort(() => Math.random() - 0.5);
    for (const photo of shuffled) {
      const url = photo.src.large2x ?? photo.src.large ?? photo.src.medium ?? null;
      if (url && !usedUrls.has(url)) return url;
    }

    // All 30 results were used — try next page
    if (page < 3) return fetchPexelsImage(query, usedUrls, page + 1);
    return null;
  } catch {
    return null;
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));

  // Collect all current image URLs and find duplicates
  const urlToFiles = new Map();
  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const m = raw.match(/^image_url:\s*"(.+?)"\s*$/m);
    if (m) {
      const url = m[1];
      if (!urlToFiles.has(url)) urlToFiles.set(url, []);
      urlToFiles.get(url).push(file);
    }
  }

  // Build set of all URLs that are already in use (for dedup uniqueness checks)
  const usedUrls = new Set(urlToFiles.keys());

  // Which files need fixing?
  let targetFiles;
  if (DEDUP_MODE) {
    // Only files that share a URL with another file (keep first occurrence, fix the rest)
    const dupFiles = new Set();
    for (const [, fileList] of urlToFiles) {
      if (fileList.length > 1) {
        fileList.slice(1).forEach(f => dupFiles.add(f)); // keep first, replace rest
      }
    }
    targetFiles = files.filter(f => dupFiles.has(f));
    console.log(`Dedup mode: ${targetFiles.length} articles have duplicate images.\n`);
  } else {
    targetFiles = files.filter(f => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, f), 'utf-8');
      return !raw.includes('image_url:');
    });
    console.log(`Adding images to ${targetFiles.length} articles without images.\n`);
  }

  let updated = 0;
  let skipped = 0;

  for (const file of targetFiles) {
    const filepath = path.join(POSTS_DIR, file);
    let raw = fs.readFileSync(filepath, 'utf-8');

    // In dedup mode, strip the existing duplicate image_url first
    if (DEDUP_MODE) {
      raw = raw.replace(/^image_url:.*\n/m, '');
    }

    const titleMatch = raw.match(/^title:\s*"?(.+?)"?\s*$/m);
    const categoryMatch = raw.match(/^category:\s*"?(.+?)"?\s*$/m);
    const title = titleMatch?.[1]?.replace(/\\"/g, '"') ?? '';
    const category = categoryMatch?.[1] ?? '';

    if (!title) { skipped++; continue; }

    const keywords = `${title} ${CATEGORY_KEYWORDS[category] ?? category}`;
    process.stdout.write(`[${updated + skipped + 1}/${targetFiles.length}] "${title.slice(0, 50)}"... `);

    const imageUrl = await fetchPexelsImage(keywords, usedUrls);

    if (imageUrl) {
      usedUrls.add(imageUrl); // mark as used immediately
      const updated_content = raw.replace(
        /^(published:\s*true)$/m,
        `image_url: "${imageUrl}"\npublished: true`
      );
      fs.writeFileSync(filepath, updated_content, 'utf-8');
      console.log('✓');
      updated++;
    } else {
      console.log('✗ no unique image found');
      skipped++;
    }

    await sleep(200);
  }

  console.log(`\nDone! ${updated} articles updated, ${skipped} skipped.`);
}

main().catch(err => { console.error(err.message); process.exit(1); });
