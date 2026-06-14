import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <div className="prose max-w-none">
        <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <h2>Information We Collect</h2>
        <p>SucceedStack is a content website. We do not collect personal information directly. However, third-party services we use (such as Google AdSense and analytics tools) may collect data including:</p>
        <ul>
          <li>IP address and general location</li>
          <li>Browser type and device information</li>
          <li>Pages visited and time spent on pages</li>
          <li>Referring URLs</li>
        </ul>

        <h2>Google AdSense</h2>
        <p>We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to this and other websites. You can opt out of personalized advertising by visiting <strong>Google Ads Settings</strong>.</p>

        <h2>Cookies</h2>
        <p>Third-party advertising and analytics services used on this site may place cookies on your device. You can control cookie settings through your browser preferences.</p>

        <h2>Content Disclaimer</h2>
        <p>Articles on SucceedStack are generated with the assistance of artificial intelligence. Content is for informational purposes only and does not constitute financial, legal, or professional advice.</p>

        <h2>Contact</h2>
        <p>For privacy-related questions, please contact us through our website.</p>
      </div>
    </div>
  );
}
