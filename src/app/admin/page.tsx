import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { fetchAdminPosts, fetchAdminProfile, fetchRecentActivities } from "@/lib/supabase/admin-queries";
import { fetchRecentComments, fetchStacks } from "@/lib/supabase/queries";
import type { Profile } from "@/types/content";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  console.log("[AdminPage] Auth check:", user ? `User found (${user.id})` : "No user");

  if (!user) {
    redirect("/login");
  }

  try {
    const profile = await fetchAdminProfile(user.id);
    console.log("[AdminPage] Profile check:", profile ? `Profile found (role: ${profile.role})` : "No profile found");
    
    // Check if user has permission (at least editor)
    if (!profile || (profile.role !== 'admin' && profile.role !== 'editor')) {
      console.warn(`[AdminPage] User ${user.id} has insufficient role: ${profile?.role}`);
      redirect("/");
    }

    const [posts, comments, stacks, activities] = await Promise.all([
      fetchAdminPosts(user.id).catch(e => { console.error("Posts fetch error:", e); return []; }),
      fetchRecentComments().catch(e => { console.error("Comments fetch error:", e); return []; }),
      fetchStacks().catch(e => { console.error("Stacks fetch error:", e); return []; }),
      fetchRecentActivities().catch(e => { console.error("Activities fetch error:", e); return []; }),
    ]);

    return <AdminDashboard profile={profile as Profile} posts={posts} comments={comments} stacks={stacks} activities={activities} />;
  } catch (error: any) {
    // Re-throw redirect errors so Next.js handles them normally
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    
    console.error("AdminPage critical error:", error);
    
    // If we're here, it's a real error. Redirect to home instead of /login to avoid the middleware loop.
    redirect("/");
  }
}
