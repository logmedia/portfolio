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
        // Buscar perfil atual para manter redes sociais
        const { data: currentProfile } = await supabase
          .from("profiles")
          .select("socials")
          .eq("id", user.id)
          .single() as any;

        let socials = (currentProfile?.socials as any[]) || [];
        const githubUsername = githubData.user_name || githubData.preferred_username || githubData.login || null;
        const githubUrl = `https://github.com/${githubUsername}`;

        // Adicionar GitHub se não existir
        if (githubUsername && !socials.some((s: any) => s.label.toLowerCase() === "github")) {
          socials.push({ label: "GitHub", url: githubUrl });
        }

        // Upsert no perfil para garantir que os dados estejam sincronizados
        await supabase.from("profiles").upsert({
          id: user.id,
          name: githubData.full_name || githubData.user_name || githubData.name || githubData.preferred_username || user.email?.split("@")[0] || "User",
          avatar_url: githubData.avatar_url || githubData.picture || githubData.avatar || null,
          github_username: githubUsername,
          bio: githubData.bio || null,
          socials: socials,
          updated_at: new Date().toISOString(),
        } as any, { onConflict: "id" });
      }
    }
  }

  // URL para redirecionar após o processo de login
  const next = requestUrl.searchParams.get("next") ?? "/admin";
  return NextResponse.redirect(new URL(next, request.url));
}
