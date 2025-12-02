import { redirect } from "react-router-dom";
import { supabase } from "../lib/supabase";

export async function authLoader() {
    // 1) get logged-in user
    const { data: authData } = await supabase.auth.getUser();

    const authUser = authData?.user;

    if (!authUser) {
        return redirect("/login");
    }

    // 2) get role from app_users
    const { data: userData } = await supabase
        .from("app_users")
        .select("role")
        .eq("auth_id", authUser.id)
        .single(); // لأنه صف واحد فقط

    if (!userData) {
        return redirect("/login");
    }

    // 3) optional — check role
    if (userData.role !== "admin") {
        return redirect("/not-allowed");
    }

    return null;
}
