'use client';

import UserManagementClient from './UserManagementClient';

export default function UserManagementPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
      <p className="text-gray-600 mb-8">Manage admin users and their roles</p>
      <UserManagementClient />
    </div>
  );
}
