import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('authToken')?.value;
  const isStaff = request.cookies.get('isStaff')?.value === 'true';

  
  const isAccessingDashboard = request.nextUrl.pathname.startsWith('/dashboard');
  
  if (isAccessingDashboard && (!authToken || !isStaff)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
}