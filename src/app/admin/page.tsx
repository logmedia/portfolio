import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { fetchPosts, fetchAdminPosts, fetchAdminProfile, fetchRecentComments, fetchStacks } from "@/lib/supabase/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { syncProfileWithGitHub } from "@/app/actions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login");
    }

    let profile = await fetchAdminProfile(user.id);

    // Sincronizar com GitHub se houver um username vinculado
    if (profile.github_username) {
      await syncProfileWithGitHub(profile.github_username);
      // Re-fetch para ter os dados atualizados no dashboard
      profile = await fetchAdminProfile(user.id);
    }

    const [posts, comments, stacks] = await Promise.all([
      fetchAdminPosts(user.id),
      fetchRecentComments(),
      fetchStacks(),
    ]);

    return <AdminDashboard profile={profile} posts={posts} comments={comments} stacks={stacks} />;
  } catch (error) {
    console.error("AdminPage error:", error);
    redirect("/login");
  }
}
