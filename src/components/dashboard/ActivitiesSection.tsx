"use client";

import { useState } from "react";
import { createActivity, toggleActivityCompletion } from "@/app/dashboard/goals/[id]/activities-actions";
import CalendarSyncButton from "./CalendarSyncButton";

type Activity = {
    id: string;
    title: string;
    description: string | null;
    scheduled_at: string | null;
    is_completed: boolean;
    is_recurring: boolean;
    recurrence_pattern: string | null;
    google_calendar_event_id: string | null;
};

export default function ActivitiesSection({
    goalId,
    activities
}: {
    goalId: string;
    activities: Activity[];
}) {
    const [isAdding, setIsAdding] = useState(false);
    const [isRecurring, setIsRecurring] = useState(false);

    async function handleCreate(formData: FormData) {
        await createActivity(goalId, formData);
        setIsAdding(false);
        setIsRecurring(false);
    }

    return (
        <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Activities</h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn-primary"
                    style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                >
                    {isAdding ? "Cancel" : "+ Add Activity"}
                </button>
            </div>

            {isAdding && (
                <form action={handleCreate} className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', display: 'grid', gap: '0.8rem' }}>
                    <input name="title" placeholder="Activity Title (e.g. Morning Run)" style={inputStyle} required />
                    <textarea name="description" placeholder="Details..." rows={2} style={inputStyle} />

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

                    <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Save Activity</button>
                </form>
            )}

            {activities.length === 0 ? (
                !isAdding && (
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <p>No activities planned yet.</p>
                    </div>
                )
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {activities.map(activity => (
                        <div key={activity.id} className="glass-panel" style={{
                            padding: '1rem',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1rem',
                            opacity: activity.is_completed ? 0.6 : 1
                        }}>
                            <input
                                type="checkbox"
                                checked={activity.is_completed}
                                onChange={() => toggleActivityCompletion(activity.id, goalId, !activity.is_completed)}
                                style={{ marginTop: '0.3rem', transform: 'scale(1.2)', cursor: 'pointer' }}
                            />

                            <div style={{ flex: 1 }}>
                                <h4 style={{
                                    margin: '0 0 0.2rem 0',
                                    textDecoration: activity.is_completed ? 'line-through' : 'none'
                                }}>
                                    {activity.title}
                                </h4>
                                {activity.description && (
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        {activity.description}
                                    </p>
                                )}
                                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {activity.scheduled_at && (
                                            <span>📅 {new Date(activity.scheduled_at).toLocaleString()}</span>
                                        )}
                                        {activity.is_recurring && (
                                            <span>🔁 {activity.recurrence_pattern}</span>
                                        )}
                                    </div>
                                    <CalendarSyncButton
                                        activityId={activity.id}
                                        goalId={goalId}
                                        isSynced={!!activity.google_calendar_event_id}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

const inputStyle = {
    width: "100%",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(0,0,0,0.2)",
    color: "white",
    fontFamily: "inherit"
};
