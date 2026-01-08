import { createClient } from "@/lib/supabase/server";
import { createGoal, deleteGoal } from "./actions";
import Link from "next/link";

export default async function GoalsPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: goals } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <header
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>My Goals</h1>
                {/* We'll use a simple toggle or modal in a real app, strict server components make modality tricky without client components. 
            For now, we render the form at the top for simplicity or as a separate page. 
            Let's keep it simple: List first, Form below or integrated. */}
            </header>

            {/* Create Goal Form */}
            <section className="glass-panel" style={{ padding: "1.5rem" }}>
                <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>Create New Goal</h3>
                <form action={createGoal} style={{ display: "grid", gap: "1rem", gridTemplateColumns: "1fr 1fr" }}>
                    <div style={{ gridColumn: "1 / -1" }}>
                        <input
                            name="title"
                            type="text"
                            required
                            placeholder="Goal Title (e.g., Buy a House)"
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ gridColumn: "1 / -1" }}>
                        <textarea
                            name="description"
                            placeholder="Description / Motivation"
                            rows={3}
                            style={{ ...inputStyle, resize: "vertical" }}
                        />
                    </div>

                    <select name="category" style={inputStyle}>
                        <option value="Personal">Personal</option>
                        <option value="Business">Business</option>
                        <option value="Health">Health</option>
                        <option value="Education">Education</option>
                        <option value="Other">Other</option>
                    </select>

                    <input
                        name="deadline"
                        type="date"
                        defaultValue=""
                        style={inputStyle}
                    />

                    <div style={{ gridColumn: "1 / -1" }}>
                        <button type="submit" className="btn-primary">
                            Add Goal
                        </button>
                    </div>
                </form>
            </section>

            {/* Goals List */}
            <div style={{ display: "grid", gap: "1rem" }}>
                {goals?.length === 0 ? (
                    <p style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>
                        No goals yet. Start by creating one!
                    </p>
                ) : (
                    goals?.map((goal) => (
                        <div
                            key={goal.id}
                            className="glass-panel"
                            style={{
                                padding: "1.5rem",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                            }}
                        >
                            <div>
                                <Link href={`/dashboard/goals/${goal.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <span
                                            style={{
                                                fontSize: '0.7rem',
                                                textTransform: 'uppercase',
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                background: 'rgba(255,255,255,0.1)',
                                                letterSpacing: '0.05em'
                                            }}
                                        >
                                            {goal.category}
                                        </span>
                                        {goal.deadline && (
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                Target: {new Date(goal.deadline).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                    <h3 style={{ margin: "0 0 0.5rem 0" }}>
                                        <Link href={`/dashboard/goals/${goal.id}`} style={{ color: 'white', textDecoration: 'none' }}>
                                            {goal.title}
                                        </Link>
                                    </h3>
                                    {goal.description && (
                                        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", margin: 0 }}>
                                            {goal.description}
                                        </p>
                                    )}
                                </Link>
                            </div>

                            <form action={deleteGoal}>
                                <input type="hidden" name="id" value={goal.id} />
                                <button
                                    type="submit"
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'rgba(255,255,255,0.3)',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem',
                                        padding: '4px'
                                    }}
                                    title="Delete Goal"
                                >
                                    &times;
                                </button>
                            </form>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(0,0,0,0.2)",
    color: "white",
    fontFamily: "inherit"
};
