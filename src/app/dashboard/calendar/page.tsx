import { createClient } from "@/lib/supabase/server";
import CalendarActivityForm from "@/components/dashboard/CalendarActivityForm";

type Activity = {
    id: string;
    goal_id: string;
    title: string;
    description: string | null;
    scheduled_at: string | null;
    is_completed: boolean;
    is_recurring: boolean;
    recurrence_pattern: string | null;
    goal: {
        title: string;
        category: string;
    };
};

export default async function CalendarPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch user's goals for the activity form
    const { data: goals } = await supabase
        .from('goals')
        .select('id, title, category')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

    // Fetch all activities for the user's goals
    const { data: activities, error } = await supabase
        .from('activities')
        .select(`
            id,
            goal_id,
            title,
            description,
            scheduled_at,
            is_completed,
            is_recurring,
            recurrence_pattern,
            goal:goals (
                title,
                category
            )
        `)
        .order('scheduled_at', { ascending: true, nullsFirst: false });

    if (error) {
        console.error("Error fetching activities:", error);
    }

    // Group activities by date
    const groupedActivities = (activities || []).reduce((acc, activity) => {
        if (activity.scheduled_at) {
            const date = new Date(activity.scheduled_at).toDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(activity as Activity);
        }
        return acc;
    }, {} as Record<string, Activity[]>);

    // Get current month details
    const now = new Date();
    const currentMonth = now.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Calendar</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        {currentMonth}
                    </p>
                </div>
            </header>

            {/* Activity Creation Form */}
            <CalendarActivityForm goals={goals || []} />

            {/* Activities Timeline */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Scheduled Activities</h3>

                {Object.keys(groupedActivities).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>📅 No activities scheduled</p>
                        <p style={{ fontSize: '0.9rem' }}>Create activities from your goals to see them here.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {Object.entries(groupedActivities)
                            .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                            .map(([date, dayActivities]) => (
                                <div key={date}>
                                    {/* Date Header */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        marginBottom: '1rem',
                                        paddingBottom: '0.5rem',
                                        borderBottom: '2px solid rgba(255,255,255,0.1)'
                                    }}>
                                        <div style={{
                                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                                            padding: '0.75rem 1rem',
                                            borderRadius: '8px',
                                            textAlign: 'center',
                                            minWidth: '80px'
                                        }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                                                {new Date(date).getDate()}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', opacity: 0.9, textTransform: 'uppercase' }}>
                                                {new Date(date).toLocaleString('en-US', { month: 'short' })}
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                                                {new Date(date).toLocaleString('en-US', { weekday: 'long' })}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {dayActivities.length} {dayActivities.length === 1 ? 'activity' : 'activities'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Activities for this date */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginLeft: '1rem' }}>
                                        {dayActivities.map(activity => (
                                            <div
                                                key={activity.id}
                                                className="glass-panel"
                                                style={{
                                                    padding: '1rem',
                                                    display: 'flex',
                                                    gap: '1rem',
                                                    alignItems: 'flex-start',
                                                    opacity: activity.is_completed ? 0.6 : 1,
                                                    borderLeft: `4px solid ${activity.is_completed ? '#4ade80' : 'var(--color-primary)'}`
                                                }}
                                            >
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                                        <h4 style={{
                                                            margin: 0,
                                                            textDecoration: activity.is_completed ? 'line-through' : 'none'
                                                        }}>
                                                            {activity.title}
                                                        </h4>
                                                        {activity.is_completed && (
                                                            <span style={{ fontSize: '0.85rem', color: '#4ade80' }}>✓ Completed</span>
                                                        )}
                                                    </div>

                                                    {activity.description && (
                                                        <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                            {activity.description}
                                                        </p>
                                                    )}

                                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                                                        <span style={{
                                                            background: 'rgba(100, 50, 255, 0.2)',
                                                            padding: '4px 10px',
                                                            borderRadius: '12px',
                                                            color: 'var(--color-secondary)'
                                                        }}>
                                                            📌 {activity.goal?.title || 'Unknown Goal'}
                                                        </span>
                                                        {activity.scheduled_at && (
                                                            <span style={{ color: 'var(--text-secondary)' }}>
                                                                🕐 {new Date(activity.scheduled_at).toLocaleTimeString('en-US', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </span>
                                                        )}
                                                        {activity.is_recurring && (
                                                            <span style={{ color: 'var(--text-secondary)' }}>
                                                                🔁 {activity.recurrence_pattern}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
