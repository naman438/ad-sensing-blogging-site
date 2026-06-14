import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { CATEGORIES } from '@/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://succeedstack.com';

  const posts = await getAllPosts(200).catch(() => []);

  const postUrls = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const categoryUrls = CATEGORIES.map((cat) => ({
    url: `${siteUrl}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    ...categoryUrls,
    ...postUrls,
  ];
}
