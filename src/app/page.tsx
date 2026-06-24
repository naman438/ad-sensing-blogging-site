import type { Metadata } from 'next';
import Link from 'next/link';
import { getRecentPosts } from '@/lib/posts';
import BlogCard from '@/components/BlogCard';
import AdUnit from '@/components/AdUnit';
import JsonLd from '@/components/JsonLd';
import { CATEGORIES } from '@/types';

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://succeedstack.com';
const SITE_NAME = 'SucceedStack';

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

export default async function HomePage() {
  const posts = await getRecentPosts(9).catch(() => []);
  const [featured, ...rest] = posts;

  const itemListSchema = posts.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Latest Articles on ${SITE_NAME}`,
    url: SITE_URL,
    itemListElement: posts.slice(0, 10).map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/blog/${p.slug}`,
      name: p.title,
    })),
  } : null;

  return (
    <>
      {itemListSchema && <JsonLd data={itemListSchema} />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <section className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{SITE_NAME}</h1>
          <p className="text-gray-500 text-lg">Expert insights on finance, tech, LLMs, and more — published daily.</p>
        </section>

        <AdUnit slot="1234567890" format="horizontal" className="mb-8 min-h-[90px]" />

        {featured && (
          <section className="mb-10">
            <BlogCard post={featured} featured />
          </section>
        )}

        <section aria-label="Browse by topic" className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </section>

        {rest.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.slice(0, 3).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        <AdUnit slot="0987654321" format="rectangle" className="mb-8 min-h-[250px]" />

        {rest.length > 3 && (
          <section className="mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.slice(3).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {posts.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No posts yet — run <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">npm run generate</code> to create your first article.</p>
          </div>
        )}

        <div className="text-center">
          <Link
            href="/blog"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View All Articles
          </Link>
        </div>
      </div>
    </>
  );
}
