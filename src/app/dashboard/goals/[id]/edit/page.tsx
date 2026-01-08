import { createClient } from "@/lib/supabase/server";
import { updateGoal } from "../../actions";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditGoalPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch Goal
    const { data: goal, error } = await supabase
        .from("goals")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !goal) {
        redirect("/dashboard/goals");
    }

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <header style={{ marginBottom: "2rem" }}>
                <Link href={`/dashboard/goals/${id}`} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'inline-block' }}>
                    &larr; Cancel
                </Link>
                <h1>Edit Goal</h1>
            </header>

            <form action={updateGoal} className="glass-panel" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <input type="hidden" name="id" value={goal.id} />

                <div>
                    <label style={labelStyle}>Title</label>
                    <input
                        name="title"
                        type="text"
                        required
                        defaultValue={goal.title}
                        style={inputStyle}
                    />
                </div>

                <div>
                    <label style={labelStyle}>Description</label>
                    <textarea
                        name="description"
                        rows={4}
                        defaultValue={goal.description || ""}
                        style={{ ...inputStyle, resize: "vertical" }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={labelStyle}>Category</label>
                        <select name="category" defaultValue={goal.category} style={inputStyle}>
                            <option value="Personal">Personal</option>
                            <option value="Business">Business</option>
                            <option value="Health">Health</option>
                            <option value="Education">Education</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label style={labelStyle}>Status</label>
                        <select name="status" defaultValue={goal.status} style={inputStyle}>
                            <option value="Active">Active</option>
                            <option value="OnHold">On Hold</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label style={labelStyle}>Target Deadline</label>
                    <input
                        name="deadline"
                        type="date"
                        defaultValue={goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : ""}
                        style={inputStyle}
                    />
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: "1rem" }}>
                    Save Changes
                </button>
            </form>
        </div>
    );
}

const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    fontSize: "0.9rem",
    color: "var(--text-secondary)",
};

const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(0,0,0,0.2)",
    color: "white",
    fontFamily: "inherit",
    outline: "none"
};
