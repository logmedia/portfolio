import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[Middleware] Missing Supabase environment variables')
    return res
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            req.cookies.set({ name, value, ...options })
            res = NextResponse.next({
              request: {
                headers: req.headers,
              },
            })
            res.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            req.cookies.set({ name, value: '', ...options })
            res = NextResponse.next({
              request: {
                headers: req.headers,
              },
            })
            res.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { pathname } = req.nextUrl

    // Debug log to terminal
    console.log(`[Middleware] Path: ${pathname} | User: ${user?.email ?? 'none'}`)

    // Protection logic
    if (pathname.startsWith('/admin')) {
      if (!user) {
        console.log(`[Middleware] Redirecting ${pathname} to /login (Unauthorized)`)
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    if (pathname.startsWith('/login')) {
      if (user) {
        console.log(`[Middleware] Redirecting ${pathname} to /admin (Already logged in)`)
        return NextResponse.redirect(new URL('/admin', req.url))
      }
    }
  } catch (e) {
    console.error('[Middleware] Error:', e)
  }

  return res
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/login'],
}
