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
                className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-4 hover:bg-blue-100 transition-colors"
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

            {/* Social sharing */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Share this article</p>
              <div className="flex gap-3 flex-wrap">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(post.title + ' — ' + SITE_URL + '/blog/' + post.slug)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-full hover:bg-green-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(SITE_URL + '/blog/' + post.slug)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 5.935zM17.083 20.75h1.833L7.084 4.126H5.117z"/></svg>
                  X (Twitter)
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL + '/blog/' + post.slug)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-full hover:bg-blue-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
              </div>
            </div>
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
