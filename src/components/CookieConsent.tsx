'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookie-consent')) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem('cookie-consent', '1');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-gray-950 border-t border-gray-800 px-4 py-4 shadow-2xl">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <p className="text-gray-300 text-sm leading-relaxed">
          We use cookies to improve your experience and serve relevant ads. By continuing, you agree to our{' '}
          <Link href="/privacy" className="text-blue-400 underline hover:text-blue-300 transition-colors">
            Privacy Policy
          </Link>.
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={accept}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition-colors"
          >
            Accept All
          </button>
          <button
            onClick={() => setVisible(false)}
            className="px-5 py-2 bg-gray-800 text-gray-400 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
