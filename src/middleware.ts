import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/login'],
}
