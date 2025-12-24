import BannerManagementClient from './BannerManagementClient';

export default function BannerManagementPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Banner Management</h1>
      <p className="text-gray-600 mb-8">Configure ad banners including skin banners, header, footer, and in-content ads</p>
      <BannerManagementClient />
    </div>
  );
}
