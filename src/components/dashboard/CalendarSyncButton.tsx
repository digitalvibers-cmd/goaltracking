"use client";

import { useState } from "react";
import { syncActivityToCalendar } from "@/lib/google-calendar";

export default function CalendarSyncButton({
    activityId,
    goalId,
    isSynced
}: {
    activityId: string;
    goalId: string;
    isSynced: boolean;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState("");

    async function handleSync() {
        setIsLoading(true);
        setStatus('idle');

        const result = await syncActivityToCalendar(activityId, goalId);

        if (result.error) {
            setStatus('error');
            setMessage(result.error);
        } else {
            setStatus('success');
            setMessage("Synced to Google Calendar!");
        }

        setIsLoading(false);
    }

    if (isSynced) {
        return (
            <span style={{
                fontSize: '0.75rem',
                color: '#4ade80',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
            }}>
                ✓ In Calendar
            </span>
        );
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
                onClick={handleSync}
                disabled={isLoading}
                style={{
                    background: 'rgba(66, 133, 244, 0.2)',
                    border: 'none',
                    color: '#4285f4',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    cursor: isLoading ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}
            >
                {isLoading ? "..." : "📅 Add to Calendar"}
            </button>

            {status === 'error' && (
                <span style={{ fontSize: '0.7rem', color: '#ff6b6b' }}>{message}</span>
            )}
            {status === 'success' && (
                <span style={{ fontSize: '0.7rem', color: '#4ade80' }}>{message}</span>
            )}
        </div>
    );
}
