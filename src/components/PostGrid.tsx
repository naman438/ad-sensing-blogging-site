'use client';

import { useState } from 'react';
import BlogCard from './BlogCard';
import type { Post } from '@/types';

const PAGE_SIZE = 9;

export default function PostGrid({ posts }: { posts: Post[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts.slice(0, visible).map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      {visible < posts.length && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="px-7 py-3 bg-white border border-gray-200 text-gray-700 font-semibold text-sm rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Load More Articles
          </button>
        </div>
      )}
    </>
  );
}
