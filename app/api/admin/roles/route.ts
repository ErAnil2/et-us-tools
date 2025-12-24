import { NextRequest, NextResponse } from 'next/server';
import { getAllRoles, createRole, updateRole, deleteRole, initializeSystemRoles, getRole, AVAILABLE_PERMISSIONS } from '@/lib/firebase';
import { cookies } from 'next/headers';

// Helper to get current user from session
async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session');

  if (!sessionCookie) return null;

  try {
    const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
    if (sessionData.exp && Date.now() > sessionData.exp) return null;
    return sessionData;
  } catch {
    return null;
  }
}

// GET - Fetch all roles
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only super_admin can view roles
    if (currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    // Initialize system roles if not exists
    await initializeSystemRoles();

    const roles = await getAllRoles();
    return NextResponse.json({ roles, permissions: AVAILABLE_PERMISSIONS });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
  }
}

// POST - Create new role
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only super_admin can create roles
    if (currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super admin can create roles' }, { status: 403 });
    }

    const body = await request.json();
    const { name, displayName, description, permissions } = body;

    if (!name || !displayName || !permissions) {
      return NextResponse.json({ error: 'Name, display name, and permissions are required' }, { status: 400 });
    }

    const result = await createRole({
      name,
      displayName,
      description: description || '',
      permissions,
      updatedBy: currentUser.id
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, role: result.role });
  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json({ error: 'Failed to create role' }, { status: 500 });
  }
}

// PUT - Update role
export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only super_admin can update roles
    if (currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super admin can update roles' }, { status: 403 });
    }

    const body = await request.json();
    const { roleId, displayName, description, permissions } = body;

    if (!roleId) {
      return NextResponse.json({ error: 'Role ID is required' }, { status: 400 });
    }

    // Check if role exists
    const existingRole = await getRole(roleId);
    if (!existingRole) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    const success = await updateRole(roleId, {
      displayName,
      description,
      permissions,
      updatedBy: currentUser.id
    });

    if (!success) {
      return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating role:', error);
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
}

// DELETE - Delete role
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only super_admin can delete roles
    if (currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super admin can delete roles' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const roleId = searchParams.get('id');

    if (!roleId) {
      return NextResponse.json({ error: 'Role ID is required' }, { status: 400 });
    }

    const result = await deleteRole(roleId);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting role:', error);
    return NextResponse.json({ error: 'Failed to delete role' }, { status: 500 });
  }
}
