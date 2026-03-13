import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { fetchAdminPosts, fetchAdminProfile, fetchRecentActivities, fetchAnalyticsSummary } from "@/lib/supabase/admin-queries";
import { fetchRecentComments, fetchStacks, fetchSiteSettings } from "@/lib/supabase/queries";
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

    const [posts, comments, stacks, activities, siteSettings, analyticsSummary] = await Promise.all([
      fetchAdminPosts(user.id).catch((e: any) => { console.error("Posts fetch error:", e); return []; }),
      fetchRecentComments().catch((e: any) => { console.error("Comments fetch error:", e); return []; }),
      fetchStacks().catch((e: any) => { console.error("Stacks fetch error:", e); return []; }),
      fetchRecentActivities().catch((e: any) => { console.error("Activities fetch error:", e); return []; }),
      fetchSiteSettings().catch((e: any) => { console.error("SiteSettings fetch error:", e); return null; }),
      fetchAnalyticsSummary().catch((e: any) => { console.error("Analytics fetch error:", e); return null; }),
    ]);

    return (
      <AdminDashboard 
        profile={profile as Profile} 
        posts={posts} 
        comments={comments} 
        stacks={stacks} 
        activities={activities}
        siteSettings={siteSettings} 
        analyticsSummary={analyticsSummary}
      />
    );
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
