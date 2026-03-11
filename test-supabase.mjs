import { createClient } from "@supabase/supabase-js";

const url = "https://jylawynncudgvfalnmmh.supabase.co"\;
const key = "sb_publishable_mq05E6QwPM3lsd0g06nJQg_8w3gkCfe";
const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("status", "active")
      .not("github_username", "is", null)
      .not("name", "is", null)
      .order("name", { ascending: true });
  console.log({ data, error });
}
test();
