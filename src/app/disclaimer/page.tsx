import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Disclaimer' };

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Disclaimer</h1>
      <div className="prose max-w-none">
        <h2>Content Accuracy</h2>
        <p>All articles published on SucceedStack are written for informational purposes. While we strive for accuracy and quality, content may contain errors, inaccuracies, or outdated information. Always verify important information from authoritative sources.</p>

        <h2>Not Professional Advice</h2>
        <p>Content on this website — including articles about finance, investing, technology, and other topics — is provided for informational and educational purposes only. It does not constitute:</p>
        <ul>
          <li>Financial or investment advice</li>
          <li>Legal advice</li>
          <li>Medical advice</li>
          <li>Professional consultation of any kind</li>
        </ul>
        <p>Always consult a qualified professional before making financial, legal, or other important decisions.</p>

        <h2>No Liability</h2>
        <p>SucceedStack and its operators shall not be liable for any losses, damages, or consequences arising from reliance on the content published on this website.</p>

        <h2>External Links</h2>
        <p>This site may contain links to external websites. We are not responsible for the content or privacy practices of those sites.</p>
      </div>
    </div>
  );
}
