import { getAllPosts } from '@/lib/posts';
import BlogCard from '@/components/BlogCard';

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim().toLowerCase() ?? '';

  const results = query.length >= 2
    ? (await getAllPosts(200)).filter((p) =>
        p.title.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query))
      )
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        {query ? `Results for "${q}"` : 'Search Articles'}
      </h1>
      {query && (
        <p className="text-gray-500 text-sm mb-8">
          {results.length} article{results.length !== 1 ? 's' : ''} found
        </p>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : query.length >= 2 ? (
        <p className="text-gray-400 py-16 text-center">No articles found for &ldquo;{q}&rdquo;.</p>
      ) : (
        <p className="text-gray-400 py-16 text-center">Type at least 2 characters to search.</p>
      )}
    </div>
  );
}
