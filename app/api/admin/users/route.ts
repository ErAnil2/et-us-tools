import { NextRequest, NextResponse } from 'next/server';
import { getAllAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser, getAdminUser } from '@/lib/firebase';
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

// GET - Fetch all users
export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only super_admin and admin can view users
    if (!['super_admin', 'admin'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    const users = await getAllAdminUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only super_admin can create users
    if (currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super admin can create users' }, { status: 403 });
    }

    const body = await request.json();
    const { username, email, password, role, name } = body;

    if (!username || !email || !password || !role || !name) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const result = await createAdminUser({
      username,
      email,
      password,
      role,
      name,
      createdBy: currentUser.id
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, user: result.user });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

// PUT - Update user
export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only super_admin can update users
    if (currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super admin can update users' }, { status: 403 });
    }

    const body = await request.json();
    const { userId, email, role, name, isActive, password } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const success = await updateAdminUser(userId, { email, role, name, isActive, password });

    if (!success) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

// DELETE - Delete user
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only super_admin can delete users
    if (currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Only super admin can delete users' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Prevent self-deletion
    if (userId === currentUser.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    const success = await deleteAdminUser(userId);

    if (!success) {
      return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
