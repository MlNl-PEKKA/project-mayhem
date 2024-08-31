import "server-only";
import { createClient } from "@supabase/supabase-js";
import { env } from "~/env";
import type { DB } from "./schema";
import { createServerClient } from "@supabase/ssr";
import type { TRPCCreateContextOptions } from "../api/trpc";

export const createServerAdminClient = () => {
  return createClient<DB>(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
};

export const createServerAnonClient = (ctx: TRPCCreateContextOptions) => {
  return createServerClient<DB>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return ctx.cookies.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value }) =>
            ctx.cookies.set(name, value),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};
