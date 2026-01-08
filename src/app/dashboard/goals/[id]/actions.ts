"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createMetric(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const goalId = formData.get("goal_id") as string;
    const title = formData.get("title") as string;
    const targetValue = formData.get("target_value") as string;
    const unit = formData.get("unit") as string;

    const { error } = await supabase.from("metrics").insert({
        goal_id: goalId,
        title,
        target_value: parseFloat(targetValue),
        current_value: 0,
        unit
    });

    if (error) {
        console.error("Error creating metric:", error);
        // return { error: "Failed to create metric" };
    }

    revalidatePath(`/dashboard/goals/${goalId}`);
}

export async function updateMetricProgress(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const metricId = formData.get("metric_id") as string;
    const goalId = formData.get("goal_id") as string;
    const currentValue = formData.get("current_value") as string;

    const { error } = await supabase.from("metrics").update({
        current_value: parseFloat(currentValue)
    }).eq("id", metricId);

    if (error) {
        console.error("Error updating metric:", error);
    }

    revalidatePath(`/dashboard/goals/${goalId}`);
}

export async function deleteMetric(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const metricId = formData.get("metric_id") as string;
    const goalId = formData.get("goal_id") as string;

    const { error } = await supabase.from("metrics").delete().eq("id", metricId);

    if (error) {
        console.error("Error deleting metric:", error);
    }

    revalidatePath(`/dashboard/goals/${goalId}`);
}
