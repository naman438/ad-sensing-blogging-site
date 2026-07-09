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

const CATEGORY_META: Record<string, { gradient: string; icon: string }> = {
  llm:          { gradient: 'from-violet-600 to-purple-800',  icon: '🤖' },
  finance:      { gradient: 'from-emerald-600 to-teal-800',   icon: '📈' },
  tech:         { gradient: 'from-blue-600 to-indigo-800',    icon: '💻' },
  crypto:       { gradient: 'from-orange-500 to-amber-700',   icon: '₿' },
  productivity: { gradient: 'from-pink-600 to-rose-700',      icon: '⚡' },
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Hero */}
        <section className="mb-10 rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 px-5 py-12 sm:px-10 sm:py-16 text-white text-center relative overflow-hidden">
          {/* Dot grid texture */}
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />
          {/* Soft glow blobs */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-blue-100 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Published twice daily
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">{SITE_NAME}</h1>
            <p className="text-blue-100 text-base sm:text-lg max-w-lg mx-auto leading-relaxed mb-8">
              Expert insights on finance, AI, technology, crypto &amp; productivity — fresh articles every day.
            </p>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-white/50 text-sm mb-8">
              <span className="flex items-center gap-1.5"><span className="text-white/80 font-semibold">85+</span> Articles</span>
              <span className="flex items-center gap-1.5"><span className="text-white/80 font-semibold">5</span> Topics</span>
              <span className="flex items-center gap-1.5"><span className="text-white/80 font-semibold">Free</span> Always</span>
            </div>

            <Link
              href="/blog"
              className="inline-block px-7 py-3 bg-white text-blue-700 rounded-full font-semibold text-sm hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
            >
              Browse All Articles →
            </Link>
          </div>
        </section>

        <AdUnit slot="1234567890" format="horizontal" className="mb-10 min-h-[90px]" />

        {/* Categories */}
        <section aria-label="Browse by topic" className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Browse by Topic</h2>
            <Link href="/blog" className="text-sm text-blue-600 hover:text-blue-700 font-medium">See all →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {CATEGORIES.map((cat, index) => {
              const meta = CATEGORY_META[cat.slug] ?? { gradient: 'from-gray-500 to-gray-700', icon: '📝' };
              const isOrphan = index === CATEGORIES.length - 1 && CATEGORIES.length % 2 !== 0;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={`group flex flex-col items-center gap-3 py-7 px-3 rounded-2xl bg-gradient-to-br ${meta.gradient} text-white hover:scale-[1.03] hover:shadow-2xl transition-all duration-200 shadow-md ${isOrphan ? 'col-span-2 sm:col-span-1' : ''}`}
                >
                  <span className="text-3xl leading-none">{meta.icon}</span>
                  <span className="text-xs font-bold uppercase tracking-wider text-center leading-tight">{cat.label}</span>
                  <span className="text-white/60 text-xs text-center hidden sm:block leading-tight">{cat.description}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured post */}
        {featured && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-1 h-6 rounded-full bg-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Featured Article</h2>
            </div>
            <BlogCard post={featured} featured />
          </section>
        )}

        {/* Recent articles */}
        {rest.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="w-1 h-6 rounded-full bg-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Latest Articles</h2>
              </div>
              <Link href="/blog" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.slice(0, 3).map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        <AdUnit slot="0987654321" format="rectangle" className="mb-10 min-h-[250px]" />

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
      </div>
    </>
  );
}
