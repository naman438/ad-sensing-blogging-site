import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostsByCategory } from '@/lib/posts';
import PostGrid from '@/components/PostGrid';
import AdUnit from '@/components/AdUnit';
import JsonLd from '@/components/JsonLd';
import { CATEGORIES } from '@/types';

const CATEGORY_GRADIENTS: Record<string, string> = {
  llm:          'from-violet-600 via-violet-700 to-purple-800',
  finance:      'from-emerald-600 via-emerald-700 to-teal-800',
  tech:         'from-blue-600 via-blue-700 to-indigo-800',
  crypto:       'from-orange-500 via-orange-600 to-amber-700',
  productivity: 'from-pink-600 via-pink-700 to-rose-700',
};

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://succeedstack.com';
const SITE_NAME = 'SucceedStack';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) return { title: 'Category Not Found' };

  const url = `${SITE_URL}/category/${cat.slug}`;
  const desc = `In-depth articles on ${cat.description}. Updated daily with fresh insights.`;

  return {
    title: `${cat.label} Articles`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${cat.label} Articles | ${SITE_NAME}`,
      description: desc,
      url,
      type: 'website',
    },
    twitter: { card: 'summary', title: `${cat.label} Articles | ${SITE_NAME}`, description: desc },
  };
}

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  const posts = await getPostsByCategory(category, 200).catch(() => []);
  const pageUrl = `${SITE_URL}/category/${cat.slug}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: cat.label, item: pageUrl },
    ],
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${cat.label} Articles`,
    description: `In-depth articles on ${cat.description}.`,
    url: pageUrl,
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    ...(posts.length > 0 && {
      hasPart: posts.slice(0, 10).map((p) => ({
        '@type': 'Article',
        headline: p.title,
        url: `${SITE_URL}/blog/${p.slug}`,
        datePublished: p.created_at,
      })),
    }),
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={collectionSchema} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Gradient category banner */}
        <section className={`mb-8 rounded-2xl bg-gradient-to-br ${CATEGORY_GRADIENTS[category] ?? 'from-gray-600 to-gray-800'} px-5 py-8 sm:py-10 sm:px-8 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
          <div className="relative z-10">
            <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-white/60 mb-3 sm:mb-4 flex items-center gap-2">
              <a href={SITE_URL} className="hover:text-white transition-colors">Home</a>
              <span aria-hidden>/</span>
              <span className="text-white/90">{cat.label}</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{cat.label}</h1>
            <p className="text-white/80 text-sm sm:text-base max-w-xl">{cat.description}</p>
          </div>
        </section>

        <AdUnit slot="2468013579" format="horizontal" className="mb-8 min-h-[90px]" />

        {posts.length === 0 ? (
          <p className="text-gray-400 text-center py-20">No articles in this category yet — check back soon!</p>
        ) : (
          <PostGrid posts={posts} />
        )}
      </div>
    </>
  );
}
