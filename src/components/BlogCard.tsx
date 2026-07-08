import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import type { Post } from '@/types';
import { CATEGORIES } from '@/types';

const CATEGORY_STYLES: Record<string, { gradient: string; emoji: string; badge: string; badgeText: string }> = {
  llm:          { gradient: 'from-violet-500 to-purple-700',  emoji: '🧠', badge: 'bg-violet-100', badgeText: 'text-violet-700' },
  finance:      { gradient: 'from-emerald-500 to-teal-700',   emoji: '📈', badge: 'bg-emerald-100', badgeText: 'text-emerald-700' },
  tech:         { gradient: 'from-blue-500 to-indigo-700',    emoji: '💻', badge: 'bg-blue-100',    badgeText: 'text-blue-700' },
  crypto:       { gradient: 'from-orange-500 to-amber-600',   emoji: '₿',  badge: 'bg-orange-100', badgeText: 'text-orange-700' },
  productivity: { gradient: 'from-pink-500 to-rose-600',      emoji: '⚡', badge: 'bg-pink-100',   badgeText: 'text-pink-700' },
};

const DEFAULT_STYLE = { gradient: 'from-gray-400 to-gray-600', emoji: '📝', badge: 'bg-gray-100', badgeText: 'text-gray-700' };

interface BlogCardProps {
  post: Post;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const category = CATEGORIES.find((c) => c.slug === post.category);
  const style = CATEGORY_STYLES[post.category] ?? DEFAULT_STYLE;
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className={`bg-gradient-to-br ${style.gradient} rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
          <div className="relative p-8 text-white">
            <div className="absolute top-4 right-6 text-8xl opacity-10 select-none leading-none">{style.emoji}</div>
            {category && (
              <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                {category.label}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 group-hover:underline leading-tight max-w-2xl">
              {post.title}
            </h2>
            <p className="text-white/75 text-sm leading-relaxed mb-5 line-clamp-3 max-w-2xl">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-3 text-white/50 text-xs">
              <span>{timeAgo}</span>
              <span aria-hidden>·</span>
              <span>{post.reading_time} min read</span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl hover:border-transparent hover:-translate-y-1 transition-all duration-200 h-full flex flex-col">
        <div className={`bg-gradient-to-br ${style.gradient} h-32 flex items-center justify-center relative overflow-hidden flex-shrink-0`}>
          <span className="text-5xl select-none drop-shadow-sm relative z-10">{style.emoji}</span>
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '18px 18px' }}
          />
        </div>

        <div className="p-4 flex flex-col flex-1">
          {category && (
            <span className={`inline-block ${style.badge} ${style.badgeText} text-xs font-semibold px-2.5 py-1 rounded-full mb-2 uppercase tracking-wide w-fit`}>
              {category.label}
            </span>
          )}
          <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
            {post.title}
          </h3>
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-2 text-gray-400 text-xs mt-auto pt-2 border-t border-gray-50">
            <span>{timeAgo}</span>
            <span aria-hidden>·</span>
            <span>{post.reading_time} min read</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
