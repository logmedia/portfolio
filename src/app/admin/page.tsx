import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { fetchPosts, fetchProfile, fetchRecentComments, fetchStacks } from "@/lib/supabase/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    const [profile, posts, comments, stacks] = await Promise.all([
      fetchProfile(),
      fetchPosts(),
      fetchRecentComments(),
      fetchStacks(),
    ]);

    return <AdminDashboard profile={profile} posts={posts} comments={comments} stacks={stacks} />;
  } catch (error) {
    console.error("AdminPage error:", error);
    redirect("/login");
  }
}
