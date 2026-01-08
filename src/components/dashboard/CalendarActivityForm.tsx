"use client";

import { useState } from "react";
import { createActivityFromCalendar } from "@/app/dashboard/calendar/actions";

type Goal = {
    id: string;
    title: string;
    category: string;
};

type CalendarActivityFormProps = {
    goals: Goal[];
};

export default function CalendarActivityForm({ goals }: CalendarActivityFormProps) {
    const [showForm, setShowForm] = useState(false);
    const [isRecurring, setIsRecurring] = useState(false);

    const inputStyle = {
        width: "100%",
        padding: "8px",
        borderRadius: "6px",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(0,0,0,0.2)",
        color: "white",
        fontFamily: "inherit"
    };

    if (!showForm) {
        return (
            <button
                onClick={() => setShowForm(true)}
                className="btn-primary"
                style={{ marginBottom: '1rem' }}
            >
                + Add Activity
            </button>
        );
    }

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>Create New Activity</h3>
                <button
                    onClick={() => setShowForm(false)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        padding: 0
                    }}
                >
                    ×
                </button>
            </div>

            <form action={createActivityFromCalendar} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <select name="goal_id" required style={inputStyle}>
                    <option value="">Select a goal...</option>
                    {goals.map((goal) => (
                        <option key={goal.id} value={goal.id}>
                            {goal.title} ({goal.category})
                        </option>
                    ))}
                </select>

                <input
                    name="title"
                    placeholder="Activity Title (e.g. Morning Run)"
                    required
                    style={inputStyle}
                />

                <textarea
                    name="description"
                    placeholder="Details..."
                    rows={2}
                    style={inputStyle}
                />

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                        name="scheduled_at"
                        type="datetime-local"
                        defaultValue=""
                        style={{ ...inputStyle, width: 'auto' }}
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        <input
                            name="is_recurring"
                            type="checkbox"
                            onChange={(e) => setIsRecurring(e.target.checked)}
                        />
                        Recurring?
                    </label>
                </div>

                {isRecurring && (
                    <input
                        name="recurrence_pattern"
                        placeholder="Pattern (e.g. Mon, Wed, Fri)"
                        style={inputStyle}
                        required
                    />
                )}

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="submit" className="btn-primary">
                        Save Activity
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        style={{
                            padding: '0.6rem 1.2rem',
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '6px',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
