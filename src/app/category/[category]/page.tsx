import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostsByCategory } from '@/lib/posts';
import BlogCard from '@/components/BlogCard';
import AdUnit from '@/components/AdUnit';
import JsonLd from '@/components/JsonLd';
import { CATEGORIES } from '@/types';

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://insightpulse.vercel.app';
const SITE_NAME = 'InsightPulse';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) return { title: 'Category Not Found' };

  const url = `${SITE_URL}/category/${cat.slug}`;
  const desc = `AI-powered articles on ${cat.description}. Updated daily with fresh insights.`;

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

  const posts = await getPostsByCategory(category, 50).catch(() => []);
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
    description: `AI-powered articles on ${cat.description}.`,
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
        <nav aria-label="Breadcrumb" className="text-sm text-gray-400 mb-6 flex items-center gap-2">
          <a href={SITE_URL} className="hover:text-blue-600">Home</a>
          <span aria-hidden>/</span>
          <span className="text-gray-600">{cat.label}</span>
        </nav>

        <div className="mb-8">
          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            Topic
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{cat.label}</h1>
          <p className="text-gray-500">{cat.description}</p>
        </div>

        <AdUnit slot="2468013579" format="horizontal" className="mb-8 min-h-[90px]" />

        {posts.length === 0 ? (
          <p className="text-gray-400 text-center py-20">No articles in this category yet — check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
