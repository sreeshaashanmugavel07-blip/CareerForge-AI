import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ReadinessReport } from "@/types";

/** Optional persistence hook for Supabase (no-op when env is missing). */
export async function insertReadinessReport(
  userId: string,
  report: ReadinessReport
): Promise<{ ok: boolean; error?: string }> {
  const sb = getSupabaseBrowserClient();
  if (!sb) return { ok: false, error: "Supabase not configured" };

  const { error } = await sb.from("readiness_reports").insert({
    user_id: userId,
    payload: report,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
