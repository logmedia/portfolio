import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createSupabaseServerClient();
    
    // Trocar código pela sessão
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && user) {
      // Sincronizar dados do perfil (foto, nome) do GitHub com o banco
      // O Supabase já armazena essas informações no metadata do usuário
      const githubData = user.user_metadata;
      
      if (githubData) {
        // Upsert no perfil para garantir que os dados estejam sincronizados
        await supabase.from("profiles").upsert({
          id: user.id,
          name: githubData.full_name || githubData.user_name || githubData.preferred_username || user.email?.split("@")[0] || "User",
          avatar_url: githubData.avatar_url || null,
          github_username: githubData.user_name || githubData.preferred_username || null,
          bio: githubData.bio || null,
          updated_at: new Date().toISOString(),
        } as any, { onConflict: "id" });
      }
    }
  }

  // URL para redirecionar após o processo de login
  return NextResponse.redirect(new URL("/admin", request.url));
}
