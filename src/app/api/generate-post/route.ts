import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { generatePost, pickRandomCategory } from '@/lib/groq';
import type { CategorySlug } from '@/types';

export const maxDuration = 60;

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const category: CategorySlug = body.category ?? pickRandomCategory();

    const post = await generatePost(category);

    if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });

    const datePrefix = post.created_at.slice(0, 10);
    const filename = `${datePrefix}-${post.slug}.md`;
    const filepath = path.join(POSTS_DIR, filename);

    const frontmatter = [
      '---',
      `title: "${post.title.replace(/"/g, '\\"')}"`,
      `slug: "${post.slug}"`,
      `category: "${post.category}"`,
      `excerpt: "${post.excerpt.replace(/"/g, '\\"')}"`,
      `tags: [${post.tags.map((t) => `"${t}"`).join(', ')}]`,
      `reading_time: ${post.reading_time}`,
      `created_at: "${post.created_at}"`,
      `updated_at: "${post.created_at}"`,
      `published: true`,
      '---',
      '',
      post.content,
    ].join('\n');

    fs.writeFileSync(filepath, frontmatter, 'utf-8');

    return NextResponse.json({ success: true, filename, slug: post.slug, title: post.title });
  } catch (err) {
    console.error('[generate-post]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
