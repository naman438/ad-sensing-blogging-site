import type { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORIES } from '@/types';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://succeedstack.com';

export const metadata: Metadata = {
  title: 'About SucceedStack',
  description: 'SucceedStack publishes daily articles on finance, technology, AI & LLMs, crypto, and productivity to help you stay informed and make better decisions.',
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: 'About SucceedStack',
    description: 'Daily insights on finance, technology, crypto, and productivity.',
    url: `${SITE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">About SucceedStack</h1>
      <p className="text-lg text-gray-500 mb-10">Your daily source for insights on finance, technology, AI, crypto, and productivity.</p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Do</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          SucceedStack is an independent publishing platform that delivers fresh, informative articles every day across five key areas: finance, technology, artificial intelligence, crypto & Web3, and personal productivity.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Our goal is simple — to make high-quality information accessible to everyone. Whether you want to understand how to invest your first ₹1,000, learn how large language models work, or discover productivity habits used by top performers, SucceedStack covers it all.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed">
          We believe staying informed should be easy. The internet is full of outdated, shallow, or paywalled content. SucceedStack is built to cut through the noise — publishing concise, well-structured articles that respect your time and give you real, actionable knowledge.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Topics We Cover</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-800 mb-1">{cat.label}</h3>
              <p className="text-sm text-gray-500">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Create Content</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          Every article on SucceedStack is researched, written, and reviewed for quality and accuracy. Every piece is crafted to be informative, well-structured, and easy to understand.
        </p>
        <p className="text-gray-600 leading-relaxed">
          All content is intended for general informational purposes only and should not be considered professional financial, legal, or investment advice. Please read our <Link href="/disclaimer" className="text-blue-600 hover:underline">disclaimer</Link> for more details.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">How Often We Publish</h2>
        <p className="text-gray-600 leading-relaxed">
          We publish new articles twice daily — once in the morning and once in the evening. This means you always have fresh content to read, covering a rotating set of topics across all five categories.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get In Touch</h2>
        <p className="text-gray-600 leading-relaxed">
          Have a suggestion, feedback, or question? We'd love to hear from you.{' '}
          <Link href="/contact" className="text-blue-600 hover:underline">Contact us here</Link>.
        </p>
      </section>
    </div>
  );
}
