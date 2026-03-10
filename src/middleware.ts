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

    // Protection logic
    if (pathname.startsWith('/admin')) {
      if (!user) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    if (pathname.startsWith('/login')) {
      if (user) {
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
