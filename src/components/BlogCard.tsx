import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import type { Post } from '@/types';
import { CATEGORIES } from '@/types';

const CATEGORY_STYLES: Record<string, { gradient: string; badge: string; badgeText: string }> = {
  llm:          { gradient: 'from-violet-600 to-purple-800',  badge: 'bg-violet-100', badgeText: 'text-violet-700' },
  finance:      { gradient: 'from-emerald-600 to-teal-800',   badge: 'bg-emerald-100', badgeText: 'text-emerald-700' },
  tech:         { gradient: 'from-blue-600 to-indigo-800',    badge: 'bg-blue-100',    badgeText: 'text-blue-700' },
  crypto:       { gradient: 'from-orange-600 to-amber-700',   badge: 'bg-orange-100', badgeText: 'text-orange-700' },
  productivity: { gradient: 'from-pink-600 to-rose-700',      badge: 'bg-pink-100',   badgeText: 'text-pink-700' },
};

const DEFAULT_STYLE = { gradient: 'from-gray-600 to-gray-800', badge: 'bg-gray-100', badgeText: 'text-gray-700' };

interface BlogCardProps {
  post: Post;
  featured?: boolean;
}

function stripMarkdown(text: string) {
  return text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1').replace(/`(.+?)`/g, '$1');
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const category = CATEGORIES.find((c) => c.slug === post.category);
  const style = CATEGORY_STYLES[post.category] ?? DEFAULT_STYLE;
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  const excerpt = stripMarkdown(post.excerpt);

  // Use Pexels image if available, otherwise fall back to Picsum
  const photoUrl = post.image_url ?? `https://picsum.photos/seed/${post.slug}/800/450`;

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article className="relative rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-72 sm:h-80">
          <Image
            src={photoUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority
          />
          {/* Category color tint */}
          <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-50`} />
          {/* Dark bottom overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          {/* Content */}
          <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
            {category && (
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide w-fit">
                {category.label}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 group-hover:underline leading-tight">
              {post.title}
            </h2>
            <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-3 max-w-2xl">
              {excerpt}
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
        {/* Unique photo per article */}
        <div className="relative h-40 overflow-hidden flex-shrink-0">
          <Image
            src={photoUrl}
            alt=""
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          />
          {/* Very subtle category tint — just enough to hint at the brand color */}
          <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-10`} />
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className={`inline-block bg-white/95 ${style.badgeText} text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm`}>
              {category?.label}
            </span>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
            {post.title}
          </h3>
          <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">
            {excerpt}
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
