import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, initializeSuperAdmin, logAdminActivity } from '@/lib/firebase';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Initialize super admin if not exists
    await initializeSuperAdmin();

    // Authenticate
    const result = await authenticateAdmin(username, password);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    // Get IP and User Agent
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const userAgent = request.headers.get('user-agent') || '';

    // Log login activity
    await logAdminActivity({
      userId: result.user!.id,
      userName: result.user!.name,
      userEmail: result.user!.email,
      userRole: result.user!.role,
      action: 'login',
      details: `User logged in successfully`,
      ipAddress,
      userAgent
    });

    // Create session token (simple base64 encoded user data)
    const sessionData = JSON.stringify({
      ...result.user,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    });
    const sessionToken = Buffer.from(sessionData).toString('base64');

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });

    return NextResponse.json({ success: true, user: result.user });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
