"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createMetric(goalId: string, formData: FormData) {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const targetValue = formData.get("target_value") as string;
    const unit = formData.get("unit") as string;
    const currentValue = formData.get("current_value") as string || "0";

    const { error } = await supabase.from("metrics").insert({
        goal_id: goalId,
        title,
        target_value: parseFloat(targetValue),
        current_value: parseFloat(currentValue),
        unit
    });

    if (error) {
        console.error("Error creating metric:", error);
        return { error: "Failed to create metric" };
    }

    revalidatePath(`/dashboard/goals/${goalId}`);
}

export async function updateMetricProgress(metricId: string, goalId: string, newValue: number) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("metrics")
        .update({ current_value: newValue })
        .eq("id", metricId);

    if (error) {
        console.error("Error updating metric:", error);
        return { error: "Failed to update metric" };
    }

    revalidatePath(`/dashboard/goals/${goalId}`);
}
