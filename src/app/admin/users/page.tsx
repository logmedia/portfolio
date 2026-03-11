import { Header } from "@/components/Header";
import { Box } from "@chakra-ui/react";
import { fetchAdminUsers, fetchAdminProfile } from "@/lib/supabase/admin-queries";
import { UserManagementContent } from "@/components/UserManagementContent";
import { redirect } from "next/navigation";

export default async function UserManagementPage() {
  const profile = await fetchAdminProfile();

  if (!profile || profile.role !== 'admin') {
    redirect("/");
  }

  const users = await fetchAdminUsers();

  return (
    <Box minH="100vh" bg="#05080c">
      <Header />
      <UserManagementContent users={users} />
    </Box>
  );
}
