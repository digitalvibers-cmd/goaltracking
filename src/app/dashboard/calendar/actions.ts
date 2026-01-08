"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createActivityFromCalendar(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const goalId = formData.get("goal_id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string || null;
    const scheduledAt = formData.get("scheduled_at") as string || null;
    const isRecurring = formData.get("is_recurring") === "on";
    const recurrencePattern = formData.get("recurrence_pattern") as string || null;

    // Verify the goal belongs to the user
    const { data: goal } = await supabase
        .from("goals")
        .select("id")
        .eq("id", goalId)
        .eq("user_id", user.id)
        .single();

    if (!goal) {
        throw new Error("Goal not found or does not belong to user");
    }

    // Create the activity
    const { error } = await supabase.from("activities").insert({
        goal_id: goalId,
        title,
        description,
        scheduled_at: scheduledAt,
        is_recurring: isRecurring,
        recurrence_pattern: isRecurring ? recurrencePattern : null,
        is_completed: false,
    });

    if (error) {
        console.error("Error creating activity:", error);
        throw error;
    }

    revalidatePath("/dashboard/calendar");
    redirect("/dashboard/calendar");
}
