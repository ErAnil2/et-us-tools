import { NextRequest, NextResponse } from 'next/server';
import { getAdminLogs, getAdminLogsByUser, logAdminActivity, AdminLogAction } from '@/lib/firebase';
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

// GET - Fetch activity logs (super admin only)
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only super_admin can view logs
    if (currentUser.role !== 'super_admin') {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    let logs;
    if (userId) {
      logs = await getAdminLogsByUser(userId, limit);
    } else {
      logs = await getAdminLogs(limit);
    }

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}

// POST - Create activity log
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, details } = body;

    if (!action || !details) {
      return NextResponse.json({ error: 'Action and details are required' }, { status: 400 });
    }

    // Get IP and User Agent from headers
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const userAgent = request.headers.get('user-agent') || '';

    const success = await logAdminActivity({
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email || currentUser.username,
      userRole: currentUser.role,
      action: action as AdminLogAction,
      details,
      ipAddress,
      userAgent
    });

    if (!success) {
      return NextResponse.json({ error: 'Failed to log activity' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging activity:', error);
    return NextResponse.json({ error: 'Failed to log activity' }, { status: 500 });
  }
}
