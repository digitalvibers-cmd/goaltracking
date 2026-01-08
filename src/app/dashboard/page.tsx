import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch summary data
    const { count: goalsCount } = await supabase
        .from('goals')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user!.id);

    // Fetch activities count with proper RLS compliance
    // We need to join through goals since RLS policy checks user_id through goal_id
    const { data: activitiesData } = await supabase
        .from('activities')
        .select('id, goal_id, is_completed, goals!inner(user_id)')
        .eq('goals.user_id', user!.id)
        .eq('is_completed', false);

    const activitiesCount = activitiesData?.length || 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Dashboard</h1>
                <Link href="/dashboard/goals" className="btn-primary" style={{ textDecoration: 'none' }}>
                    + New Goal
                </Link>
            </header>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem'
            }}>
                <StatCard title="Active Goals" value={goalsCount || 0} />
                <StatCard title="Pending Activities" value={activitiesCount} />
                <StatCard title="Achieved This Month" value="0" />
            </div>

            {/* Recent Activity Section */}
            <section className="glass-panel" style={{ padding: '2rem', minHeight: '300px' }}>
                <h3>Recent Activity</h3>
                <p style={{ color: 'var(--text-secondary)' }}>No recent activities found.</p>
            </section>
        </div>
    );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
    return (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                {title}
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>
                {value}
            </p>
        </div>
    )
}
