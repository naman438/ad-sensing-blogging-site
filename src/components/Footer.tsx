import Link from 'next/link';
import { CATEGORIES } from '@/types';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold text-lg mb-3">SucceedStack</h3>
            <p className="text-sm leading-relaxed">
              AI-powered articles on finance, technology, LLMs, and more. Fresh insights published daily.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">Topics</h4>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-white transition-colors">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} SucceedStack. Content generated with AI for informational purposes only.</p>
        </div>
      </div>
    </footer>
  );
}
