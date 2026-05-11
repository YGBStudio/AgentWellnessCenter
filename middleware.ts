import { NextResponse, type NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth/utils'
import { Role } from '@/lib/auth/types'

type ProtectedRoute = {
  path: string
  roles: Role[]
}

const PROTECTED_ROUTES: ProtectedRoute[] = [
  { path: '/dashboard', roles: ['admin', 'staff'] },
  { path: '/agents', roles: ['admin', 'staff'] },
  { path: '/ailments', roles: ['admin', 'staff'] },
  { path: '/therapies', roles: ['admin', 'staff'] },
  { path: '/appointments', roles: ['admin', 'staff'] },
]

const PUBLIC_ROUTES = ['/', '/booking', '/booking/confirmation', '/login']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip API routes — those are handled by their own middleware
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const session = request.cookies.get('agentclinic_session')
  const token = session?.value
  const user = token ? await verifyToken(token) : null

  // Authenticated user trying to access login → redirect to dashboard
  if (pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Check if the route is protected
  const requiredRoles = PROTECTED_ROUTES.find((route) => route.path === pathname)?.roles

  if (requiredRoles) {
    // Not authenticated → redirect to login
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Authenticated but wrong role → access denied
    if (!requiredRoles.includes('any') && !requiredRoles.includes(user.role)) {
      return NextResponse.redirect(new URL('/access-denied', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all routes except static assets and API routes
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}