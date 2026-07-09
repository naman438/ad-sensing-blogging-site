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

const CATEGORY_STYLES: Record<string, { gradient: string }> = {
  llm:          { gradient: 'from-violet-500 to-purple-700' },
  finance:      { gradient: 'from-emerald-500 to-teal-700'  },
  tech:         { gradient: 'from-blue-500 to-indigo-700'   },
  crypto:       { gradient: 'from-orange-500 to-amber-600'  },
  productivity: { gradient: 'from-pink-500 to-rose-600'     },
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

        {/* Hero */}
        <section className="mb-10 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-4 py-10 sm:px-8 sm:py-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 tracking-tight">{SITE_NAME}</h1>
            <p className="text-blue-100 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Expert insights on finance, technology, crypto, and productivity — published daily.
            </p>
          </div>
        </section>

        <AdUnit slot="1234567890" format="horizontal" className="mb-8 min-h-[90px]" />

        {/* Categories */}
        <section aria-label="Browse by topic" className="mb-10">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Browse by Topic</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {CATEGORIES.map((cat, index) => {
              const style = CATEGORY_STYLES[cat.slug] ?? { gradient: 'from-gray-400 to-gray-600' };
              const isOrphan = index === CATEGORIES.length - 1 && CATEGORIES.length % 2 !== 0;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={`group flex flex-col items-center gap-2 py-5 px-3 rounded-xl bg-gradient-to-br ${style.gradient} text-white hover:scale-105 hover:shadow-lg transition-all duration-200 ${isOrphan ? 'col-span-2 sm:col-span-1' : ''}`}
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-center leading-tight">{cat.label}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured post */}
        {featured && (
          <section className="mb-10">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Featured</h2>
            <BlogCard post={featured} featured />
          </section>
        )}

        {/* Recent articles */}
        {rest.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Recent Articles</h2>
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
            <p className="text-lg">No posts yet — check back soon!</p>
          </div>
        )}

        <div className="text-center mt-4">
          <Link
            href="/blog"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          >
            View All Articles →
          </Link>
        </div>
      </div>
    </>
  );
}
