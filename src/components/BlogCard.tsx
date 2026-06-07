import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import type { Post } from '@/types';
import { CATEGORIES } from '@/types';

interface BlogCardProps {
  post: Post;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const category = CATEGORIES.find((c) => c.slug === post.category);
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          {category && (
            <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
              {category.label}
            </span>
          )}
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:underline leading-tight">
            {post.title}
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed mb-4 line-clamp-3">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-3 text-blue-200 text-xs">
            <span>{timeAgo}</span>
            <span>·</span>
            <span>{post.reading_time} min read</span>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-blue-200 transition-all duration-200 h-full flex flex-col">
        {category && (
          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 uppercase tracking-wide w-fit">
            {category.label}
          </span>
        )}
        <h3 className="font-semibold text-gray-900 text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
          {post.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-2 text-gray-400 text-xs mt-auto">
          <span>{timeAgo}</span>
          <span>·</span>
          <span>{post.reading_time} min read</span>
        </div>
      </article>
    </Link>
  );
}
