import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';
import PostGrid from '@/components/PostGrid';
import AdUnit from '@/components/AdUnit';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'All Articles',
  description: 'Browse all articles on finance, LLMs, technology, crypto, and productivity.',
};

export default async function BlogPage() {
  const posts = await getAllPosts(200).catch(() => []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">All Articles</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-8">Fresh insights published daily across multiple topics.</p>

      <AdUnit slot="1122334455" format="horizontal" className="mb-8 min-h-[90px]" />

      {posts.length === 0 ? (
        <p className="text-gray-400 text-center py-20">No articles yet — check back soon!</p>
      ) : (
        <PostGrid posts={posts} />
      )}
    </div>
  );
}
