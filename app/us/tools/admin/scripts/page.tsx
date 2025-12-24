import ScriptManagementClient from './ScriptManagementClient';

export default function ScriptManagementPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Script Management</h1>
      <p className="text-gray-600 mb-8">Add GTM, Google Analytics, and custom scripts to the header or body section</p>
      <ScriptManagementClient />
    </div>
  );
}
