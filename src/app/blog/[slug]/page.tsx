import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow, format } from 'date-fns';
import { getPostBySlug, getRelatedPosts } from '@/lib/posts';
import BlogCard from '@/components/BlogCard';
import AdUnit from '@/components/AdUnit';
import JsonLd from '@/components/JsonLd';
import { CATEGORIES } from '@/types';

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://succeedstack.com';
const SITE_NAME = 'SucceedStack';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };

  const url = `${SITE_URL}/blog/${post.slug}`;
  const category = CATEGORIES.find((c) => c.slug === post.category);

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: SITE_NAME }],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url,
      siteName: SITE_NAME,
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      section: category?.label,
      tags: post.tags,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

function buildArticleSchema(post: Awaited<ReturnType<typeof getPostBySlug>>) {
  if (!post) return null;
  const url = `${SITE_URL}/blog/${post.slug}`;
  const category = CATEGORIES.find((c) => c.slug === post.category);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    url,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: category?.label ?? post.category,
    keywords: post.tags.join(', '),
    wordCount: post.content.split(/\s+/).length,
    timeRequired: `PT${post.reading_time}M`,
    inLanguage: 'en-US',
  };
}

function buildBreadcrumbSchema(post: Awaited<ReturnType<typeof getPostBySlug>>) {
  if (!post) return null;
  const category = CATEGORIES.find((c) => c.slug === post.category);

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      category && { '@type': 'ListItem', position: 2, name: category.label, item: `${SITE_URL}/category/${category.slug}` },
      { '@type': 'ListItem', position: category ? 3 : 2, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
    ].filter(Boolean),
  };
}

function markdownToHtml(md: string): string {
  return md
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hup])/gm, '')
    .replace(/^(.+)$/gm, (line) => (line.startsWith('<') ? line : `<p>${line}</p>`))
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<[hul])/g, '$1')
    .replace(/(<\/[hul][^>]*>)<\/p>/g, '$1');
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post.category, post.slug);
  const category = CATEGORIES.find((c) => c.slug === post.category);
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  const publishedDate = format(new Date(post.created_at), 'MMMM d, yyyy');
  const htmlContent = markdownToHtml(post.content);
  const articleSchema = buildArticleSchema(post);
  const breadcrumbSchema = buildBreadcrumbSchema(post);

  return (
    <>
      {articleSchema && <JsonLd data={articleSchema} />}
      {breadcrumbSchema && <JsonLd data={breadcrumbSchema} />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex gap-8">
          {/* Article */}
          <article className="flex-1 min-w-0">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="text-sm text-gray-400 mb-6 flex items-center gap-2 flex-wrap">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <span aria-hidden>/</span>
              {category && (
                <>
                  <Link href={`/category/${category.slug}`} className="hover:text-blue-600">{category.label}</Link>
                  <span aria-hidden>/</span>
                </>
              )}
              <span className="text-gray-600 truncate max-w-xs">{post.title}</span>
            </nav>

            {category && (
              <Link
                href={`/category/${category.slug}`}
                className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-4 hover:bg-blue-100"
              >
                {category.label}
              </Link>
            )}

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
              {post.title}
            </h1>

            <div className="flex items-center gap-3 text-gray-400 text-sm mb-6 pb-6 border-b border-gray-200 flex-wrap">
              <time dateTime={post.created_at} title={publishedDate}>{timeAgo}</time>
              <span aria-hidden>·</span>
              <span>{post.reading_time} min read</span>
              {post.tags.length > 0 && (
                <>
                  <span aria-hidden>·</span>
                  <div className="flex gap-1 flex-wrap">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-xs">{tag}</span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <AdUnit slot="5544332211" format="rectangle" className="mb-8 min-h-[250px]" />

            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            <AdUnit slot="9988776655" format="horizontal" className="mt-10 min-h-[90px]" />
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <AdUnit slot="1357924680" format="vertical" className="mb-6 min-h-[600px]" />
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-14 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-5">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
