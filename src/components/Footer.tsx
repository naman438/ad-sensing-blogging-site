import Link from 'next/link';
import { CATEGORIES } from '@/types';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                S
              </div>
              <h3 className="text-white font-bold text-lg">SucceedStack</h3>
            </div>
            <p className="text-sm leading-relaxed">
              In-depth articles on finance, technology, crypto, AI, and productivity. Fresh insights published daily.
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
            <h4 className="text-white font-medium mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} SucceedStack. Content is for informational purposes only.</p>
        </div>
      </div>
    </footer>
  );
}
