import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://succeedstack.com';

export const metadata: Metadata = {
  title: 'Contact Us | SucceedStack',
  description: 'Get in touch with the SucceedStack team for feedback, suggestions, or general enquiries.',
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: 'Contact Us | SucceedStack',
    description: 'Get in touch with the SucceedStack team.',
    url: `${SITE_URL}/contact`,
  },
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
      <p className="text-lg text-gray-500 mb-10">
        Have a question, suggestion, or feedback? We'd love to hear from you.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Send Us a Message</h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              placeholder="What is this about?"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              rows={5}
              placeholder="Write your message here..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <a
            href="mailto:contact@succeedstack.com"
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Send Message
          </a>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Other Ways to Reach Us</h2>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-center gap-3">
            <span className="text-blue-600 font-medium">Email:</span>
            <a href="mailto:contact@succeedstack.com" className="hover:text-blue-600 transition-colors">
              contact@succeedstack.com
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-blue-600 font-medium">Website:</span>
            <Link href="/" className="hover:text-blue-600 transition-colors">
              succeedstack.com
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-gray-400 text-center">
        We typically respond within 1-2 business days.
      </p>
    </div>
  );
}
