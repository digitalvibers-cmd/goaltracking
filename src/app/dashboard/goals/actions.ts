"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createGoal(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const deadline = formData.get("deadline") as string;

    const { error } = await supabase.from("goals").insert({
        user_id: user.id,
        title,
        description,
        category,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        status: 'Active'
    });

    if (error) {
        console.error("Error creating goal:", error);
        // In a real app, we should return the error to the client
        // return { error: "Failed to create goal" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/goals");
    redirect("/dashboard/goals");
}

export async function deleteGoal(formData: FormData) {
    const supabase = await createClient();
    const id = formData.get("id") as string;

    const { error } = await supabase.from("goals").delete().eq("id", id);

    if (error) {
        console.error("Error deleting goal:", error);
        // return { error: "Failed to delete goal" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/goals");
}

export async function updateGoal(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const deadline = formData.get("deadline") as string;
    const status = formData.get("status") as string;

    const { error } = await supabase.from("goals").update({
        title,
        description,
        category,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        status
    }).eq("id", id).eq("user_id", user.id);

    if (error) {
        console.error("Error updating goal:", error);
        // return { error: "Failed to update goal" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/goals");
    revalidatePath(`/dashboard/goals/${id}`);
    redirect(`/dashboard/goals/${id}`);
}
