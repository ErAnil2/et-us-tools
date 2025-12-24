import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get session cookie from request headers directly
    const sessionCookie = request.cookies.get('admin_session');

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json({ authenticated: false });
    }

    try {
      const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());

      // Check if session expired
      if (sessionData.exp && Date.now() > sessionData.exp) {
        const response = NextResponse.json({ authenticated: false, error: 'Session expired' });
        response.cookies.delete('admin_session');
        return response;
      }

      return NextResponse.json({
        authenticated: true,
        user: {
          id: sessionData.id,
          username: sessionData.username,
          email: sessionData.email,
          role: sessionData.role,
          name: sessionData.name
        }
      });
    } catch {
      return NextResponse.json({ authenticated: false });
    }
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({ authenticated: false });
  }
}
