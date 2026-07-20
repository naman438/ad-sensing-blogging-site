'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="my-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-12 text-center text-white">
        <div className="text-4xl mb-3">🎉</div>
        <h2 className="text-xl font-bold mb-2">You&apos;re subscribed!</h2>
        <p className="text-blue-100 text-sm">Thanks for joining. Fresh articles will land in your inbox soon.</p>
      </section>
    );
  }

  return (
    <section className="my-10 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-4 sm:px-5 py-8 sm:py-12 text-center text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
      <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="relative z-10 max-w-lg mx-auto">
        <div className="inline-block bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 sm:mb-4 uppercase tracking-wide">
          Newsletter
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3">Stay ahead of the curve</h2>
        <p className="text-blue-100 text-sm sm:text-base mb-5 sm:mb-7 leading-relaxed">
          Get the best articles on finance, AI, tech &amp; productivity — curated and delivered to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="flex-1 px-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/60 placeholder-gray-400"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-white text-blue-700 font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors shadow-lg flex-shrink-0"
          >
            Subscribe →
          </button>
        </form>
        <p className="text-blue-200/60 text-xs mt-4">No spam. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
