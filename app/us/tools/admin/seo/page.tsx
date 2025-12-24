import SEOManagementClient from './SEOManagementClient';

export default function SEOManagementPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">SEO Management</h1>
      <p className="text-gray-600 mb-8">Manage meta titles, descriptions, H1 tags, and FAQs for all pages</p>
      <SEOManagementClient />
    </div>
  );
}
