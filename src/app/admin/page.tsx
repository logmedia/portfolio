import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { fetchPosts, fetchProfile, fetchRecentComments } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [profile, posts, comments] = await Promise.all([
    fetchProfile(),
    fetchPosts(),
    fetchRecentComments(),
  ]);

  return <AdminDashboard profile={profile} posts={posts} comments={comments} />;
}
