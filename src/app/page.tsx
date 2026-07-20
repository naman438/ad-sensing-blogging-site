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
  llm:          { gradient: 'from-violet-500 to-purple-700',  icon: '🤖' },
  finance:      { gradient: 'from-emerald-500 to-teal-700',   icon: '📈' },
  tech:         { gradient: 'from-blue-500 to-indigo-700',    icon: '💻' },
  crypto:       { gradient: 'from-orange-400 to-amber-600',   icon: '₿'  },
  productivity: { gradient: 'from-pink-500 to-rose-600',      icon: '⚡' },
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

        {/* Hero — glass card so gradient mesh shows through */}
        <section className="mb-10 rounded-3xl bg-white/60 backdrop-blur-md border border-white shadow-2xl px-5 py-12 sm:px-10 sm:py-16 text-center relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full text-xs font-semibold text-blue-600 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Published twice daily
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 tracking-tight text-gray-900">{SITE_NAME}</h1>
            <p className="text-gray-500 text-base sm:text-lg max-w-lg mx-auto leading-relaxed mb-8">
              Expert insights on finance, AI, technology, crypto &amp; productivity — fresh articles every day.
            </p>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-400 mb-8">
              <span><span className="text-gray-800 font-bold">100+</span> Articles</span>
              <span><span className="text-gray-800 font-bold">5</span> Topics</span>
              <span><span className="text-gray-800 font-bold">Free</span> Always</span>
            </div>

            <Link
              href="/blog"
              className="inline-block px-7 py-3 bg-blue-600 text-white rounded-full font-semibold text-sm hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              Browse All Articles →
            </Link>
          </div>
        </section>

        <AdUnit slot="1234567890" format="horizontal" className="mb-10 min-h-[90px]" />

        {/* Categories — glass tiles matching hero */}
        <section aria-label="Browse by topic" className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Browse by Topic</h2>
            <Link href="/blog" className="text-sm text-blue-600 hover:text-blue-700 font-medium">See all →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {CATEGORIES.map((cat, index) => {
              const meta = CATEGORY_META[cat.slug] ?? { gradient: 'from-gray-400 to-gray-600', icon: '📝' };
              const isOrphan = index === CATEGORIES.length - 1 && CATEGORIES.length % 2 !== 0;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={`group flex flex-col gap-3 p-5 rounded-2xl bg-white/70 backdrop-blur-sm border border-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ${isOrphan ? 'col-span-2 sm:col-span-1' : ''}`}
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center text-xl shadow-sm flex-shrink-0`}>
                    {meta.icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-tight">{cat.label}</p>
                    <p className="text-gray-400 text-xs mt-1 leading-snug line-clamp-2">{cat.description}</p>
                  </div>
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
