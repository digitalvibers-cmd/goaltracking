"use client";

import { useState } from "react";
import Link from "next/link";
import MetricsSection from "@/components/dashboard/MetricsSection";
import ActivitiesSection from "@/components/dashboard/ActivitiesSection";

// Types
type Goal = {
    id: string;
    title: string;
    description: string | null;
    category: string;
    status: string;
    deadline: string | null;
};

type Metric = {
    id: string;
    title: string;
    target_value: number;
    current_value: number;
    unit: string;
};

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

export default function GoalDetailView({
    goal,
    metrics,
    activities
}: {
    goal: Goal;
    metrics: Metric[];
    activities: Activity[];
}) {
    const [activeTab, setActiveTab] = useState<'overview' | 'activities'>('overview');

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Header / Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.7 }}>
                <Link href="/dashboard/goals" style={{ color: 'inherit', textDecoration: 'none' }}>Goals</Link>
                <span>/</span>
                <span>{goal.title}</span>
            </div>

            <header className="glass-panel" style={{ padding: "2rem", position: 'relative', overflow: 'hidden' }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '4px',
                    background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))'
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <span style={{
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            letterSpacing: '0.1em',
                            color: 'var(--color-secondary)'
                        }}>
                            {goal.category}
                        </span>
                        <h1 style={{ margin: "0.5rem 0", fontSize: '2.5rem' }}>{goal.title}</h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: '600px' }}>
                            {goal.description || "No description provided."}
                        </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Target Date</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                            {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : "No deadline"}
                        </div>
                        <div style={{
                            marginTop: '1rem',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            background: goal.status === 'Active' ? 'rgba(50, 255, 100, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                            color: goal.status === 'Active' ? '#4ade80' : 'white',
                            display: 'inline-block',
                            fontSize: '0.8rem',
                            fontWeight: 600
                        }}>
                            {goal.status}
                        </div>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '2rem' }}>
                <button
                    onClick={() => setActiveTab('overview')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: activeTab === 'overview' ? 'white' : 'var(--text-secondary)',
                        borderBottom: activeTab === 'overview' ? '2px solid var(--color-primary)' : '2px solid transparent',
                        padding: '1rem 0',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}>
                    Overview & Metrics
                </button>
                <button
                    onClick={() => setActiveTab('activities')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: activeTab === 'activities' ? 'white' : 'var(--text-secondary)',
                        borderBottom: activeTab === 'activities' ? '2px solid var(--color-primary)' : '2px solid transparent',
                        padding: '1rem 0',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}>
                    Activities
                </button>
            </div>

            {/* Content Area */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                {/* Left Column: Tab Content */}
                <div>
                    {activeTab === 'overview' ? (
                        <MetricsSection goalId={goal.id} metrics={metrics} />
                    ) : (
                        <ActivitiesSection goalId={goal.id} activities={activities} />
                    )}
                </div>

                {/* Right Column: Quick Actions */}
                <section>
                    <h3>Quick Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button className="glass-panel" style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}>
                            Edit Goal Details
                        </button>
                        <button className="glass-panel" style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', border: '1px solid rgba(255,50,50,0.2)', color: '#ff8888' }}>
                            Delete Goal
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
