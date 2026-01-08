"use client";

import { useState } from "react";
import { createMetric, updateMetricProgress } from "@/app/dashboard/goals/[id]/metrics-actions";

type Metric = {
    id: string;
    title: string;
    target_value: number;
    current_value: number;
    unit: string;
};

export default function MetricsSection({
    goalId,
    metrics
}: {
    goalId: string;
    metrics: Metric[];
}) {
    const [isAdding, setIsAdding] = useState(false);

    async function handleCreate(formData: FormData) {
        await createMetric(goalId, formData);
        setIsAdding(false);
    }

    async function handleUpdate(metricId: string, currentValue: number, change: number) {
        const newValue = currentValue + change;
        await updateMetricProgress(metricId, goalId, newValue);
    }

    return (
        <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Metrics</h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn-primary"
                    style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                >
                    {isAdding ? "Cancel" : "+ Add Metric"}
                </button>
            </div>

            {isAdding && (
                <form action={handleCreate} className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', display: 'grid', gap: '0.5rem' }}>
                    <input name="title" placeholder="Metric Name (e.g. Books Read)" style={inputStyle} required />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input name="current_value" type="number" placeholder="Current (0)" style={inputStyle} />
                        <input name="target_value" type="number" placeholder="Target (10)" style={inputStyle} required />
                        <input name="unit" placeholder="Unit (e.g. books)" style={inputStyle} />
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Save Metric</button>
                </form>
            )}

            {metrics.length === 0 ? (
                !isAdding && (
                    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <p>No metrics defined yet.</p>
                        <p style={{ fontSize: '0.9rem' }}>Define how you measure success for this goal.</p>
                    </div>
                )
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {metrics.map(metric => (
                        <div key={metric.id} className="glass-panel" style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 600 }}>{metric.title}</span>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    {metric.current_value} / {metric.target_value} {metric.unit}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
                                <div style={{
                                    height: '100%',
                                    width: `${Math.min((metric.current_value / metric.target_value) * 100, 100)}%`,
                                    background: 'var(--color-primary)',
                                    transition: 'width 0.3s ease'
                                }} />
                            </div>

                            {/* Quick Update Controls */}
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => handleUpdate(metric.id, metric.current_value, -1)}
                                    style={miniBtnStyle}>-</button>
                                <button
                                    onClick={() => handleUpdate(metric.id, metric.current_value, 1)}
                                    style={miniBtnStyle}>+</button>
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

const miniBtnStyle = {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: 'white',
    width: '30px',
    height: '30px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
};
