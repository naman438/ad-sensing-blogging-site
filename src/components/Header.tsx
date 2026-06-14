'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CATEGORIES } from '@/types';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            SucceedStack
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden pb-3 flex flex-col gap-1">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                onClick={() => setMenuOpen(false)}
              >
                {cat.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
