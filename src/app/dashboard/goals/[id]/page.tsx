import { getGoal } from "./getGoal";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import GoalDetailView from "@/components/dashboard/GoalDetailView";

export default async function GoalDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    // Await params first (Next.js 15 requirement)
    const { id } = await params;
    const goal = await getGoal(id);
    const supabase = await createClient();

    if (!goal) {
        notFound();
    }

    // Fetch metrics
    const { data: metrics } = await supabase
        .from("metrics")
        .select("*")
        .eq("goal_id", id)
        .order("created_at", { ascending: true });

    // Fetch activities
    const { data: activities } = await supabase
        .from("activities")
        .select("*")
        .eq("goal_id", id)
        .order("scheduled_at", { ascending: true });

    return (
        <GoalDetailView
            goal={goal}
            metrics={metrics || []}
            activities={activities || []}
        />
    );
}
