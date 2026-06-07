import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Post } from '@/types';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

function ensureDir() {
  if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
}

function parsePost(filename: string): Post | null {
  try {
    const filePath = path.join(POSTS_DIR, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    return {
      id: data.slug,
      title: data.title,
      slug: data.slug,
      content,
      excerpt: data.excerpt ?? '',
      category: data.category,
      tags: data.tags ?? [],
      reading_time: data.reading_time ?? 5,
      published: data.published !== false,
      created_at: data.created_at ?? new Date().toISOString(),
      updated_at: data.updated_at ?? data.created_at ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function getAllFiles(): string[] {
  ensureDir();
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .reverse();
}

export async function getAllPosts(limit = 50): Promise<Post[]> {
  return getAllFiles()
    .slice(0, limit)
    .map(parsePost)
    .filter((p): p is Post => p !== null && p.published);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  ensureDir();
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  const file = files.find((f) => parsePost(f)?.slug === slug);
  return file ? parsePost(file) : null;
}

export async function getPostsByCategory(category: string, limit = 50): Promise<Post[]> {
  const all = await getAllPosts(200);
  return all.filter((p) => p.category === category).slice(0, limit);
}

export async function getRecentPosts(limit = 6): Promise<Post[]> {
  return getAllPosts(limit);
}

export async function getRelatedPosts(category: string, excludeSlug: string, limit = 3): Promise<Post[]> {
  const all = await getAllPosts(100);
  return all.filter((p) => p.category === category && p.slug !== excludeSlug).slice(0, limit);
}
