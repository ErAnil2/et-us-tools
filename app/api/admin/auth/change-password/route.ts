import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser, updateAdminUser, verifyPassword, logAdminActivity } from '@/lib/firebase';

// Helper to get current user from session
function getCurrentUserFromRequest(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin_session');

  if (!sessionCookie || !sessionCookie.value) return null;

  try {
    const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
    if (sessionData.exp && Date.now() > sessionData.exp) return null;
    return sessionData;
  } catch {
    return null;
  }
}

// POST - Change password for any logged-in user
export async function POST(request: NextRequest) {
  try {
    const currentUser = getCurrentUserFromRequest(request);

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: 'New passwords do not match' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    // Get the full user object to verify current password
    const user = await getAdminUser(currentUser.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    // Update password
    const success = await updateAdminUser(currentUser.id, { password: newPassword });

    if (!success) {
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }

    // Log the password change activity
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const userAgent = request.headers.get('user-agent') || '';

    await logAdminActivity({
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userRole: currentUser.role,
      action: 'user_update',
      details: 'User changed their password',
      ipAddress,
      userAgent
    });

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
  }
}
