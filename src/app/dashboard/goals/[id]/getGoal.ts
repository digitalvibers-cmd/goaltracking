"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getGoal = cache(async (id: string) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: goal, error } = await supabase
        .from("goals")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (error || !goal) {
        return null;
    }

    return goal;
});
