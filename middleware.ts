import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function decodeBase64(b64: string) {
  if (typeof (globalThis as any).atob === 'function') {
    return (globalThis as any).atob(b64)
  }
  throw new Error('Base64 decoder not available')
}

export function middleware(req: NextRequest) {
  const auth = req.headers.get('authorization') || ''
  const [scheme, b64] = auth.split(' ')

  if (scheme === 'Basic' && b64) {
    try {
      const decoded = decodeBase64(b64)
      const [u, p] = decoded.split(':')
      if (u === process.env.BASIC_AUTH_USER && p === process.env.BASIC_AUTH_PASS) {
        return NextResponse.next()
      }
    } catch {
      // ignore
    }
  }

  return new NextResponse('Auth required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Dashboard"' },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
