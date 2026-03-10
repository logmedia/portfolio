import { cookies } from "next/headers";
import { createServerClient } from "@supabase/auth-helpers-nextjs";
import type { CookieOptions } from "@supabase/auth-helpers-nextjs";
import type { Database } from "./types";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Supabase credentials missing in server client");
  }

  return createServerClient<Database>(
    url,
    key,
    {
      cookies: {
        get(name: string) {
          try {
            return cookieStore.get(name)?.value;
          } catch (error) {
            console.error(`[Supabase Server] Error getting cookie ${name}:`, error);
            return undefined;
          }
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // This is expected to fail during Server Component rendering
            // if Supabase tries to refresh a token.
            console.warn(`[Supabase Server] Could not set cookie ${name} (possibly in RSC):`, error);
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options, maxAge: 0 });
          } catch (error) {
            console.warn(`[Supabase Server] Could not remove cookie ${name} (possibly in RSC):`, error);
          }
        },
      },
    }
  );
}
