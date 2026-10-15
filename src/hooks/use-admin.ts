import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AdminState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "not-admin" }
  | { status: "admin"; userId: string; email: string };

export function useAdmin(): AdminState {
  const [state, setState] = useState<AdminState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function check() {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        if (!cancelled) setState({ status: "signed-out" });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin");
      if (cancelled) return;
      if (roles && roles.length > 0) {
        setState({ status: "admin", userId: session.user.id, email: session.user.email ?? "" });
      } else {
        setState({ status: "not-admin" });
      }
    }

    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
