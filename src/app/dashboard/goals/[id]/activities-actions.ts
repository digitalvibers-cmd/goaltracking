"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createActivity(goalId: string, formData: FormData) {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const scheduledAt = formData.get("scheduled_at") as string;
    const isRecurring = formData.get("is_recurring") === "on";
    const recurrencePattern = formData.get("recurrence_pattern") as string;

    const { error } = await supabase.from("activities").insert({
        goal_id: goalId,
        title,
        description,
        scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        is_recurring: isRecurring,
        recurrence_pattern: isRecurring ? recurrencePattern : null
    });

    if (error) {
        console.error("Error creating activity:", error);
        return { error: "Failed to create activity" };
    }

    revalidatePath(`/dashboard/goals/${goalId}`);
}

export async function toggleActivityCompletion(activityId: string, goalId: string, isCompleted: boolean) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("activities")
        .update({ is_completed: isCompleted })
        .eq("id", activityId);

    if (error) {
        console.error("Error updating activity:", error);
        return { error: "Failed to update activity" };
    }

    revalidatePath(`/dashboard/goals/${goalId}`);
}
