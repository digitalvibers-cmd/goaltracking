import NavLinks from "@/components/dashboard/NavLinks";
import { signout } from "../login/actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar */}
            <aside
                className="glass-panel"
                style={{
                    width: "250px",
                    margin: "1rem",
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem",
                    position: 'sticky',
                    top: '1rem',
                    height: 'calc(100vh - 2rem)'
                }}
            >
                <div style={{ padding: "0 0.5rem" }}>
                    <h2 style={{ margin: 0, fontSize: "1.5rem", color: "var(--color-primary)" }}>
                        Goal Tracker
                    </h2>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
                        {user.email}
                    </p>
                </div>

                <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
                    <NavLinks />
                </nav>

                <form action={signout}>
                    <button
                        type="submit"
                        style={{
                            background: 'rgba(255, 50, 50, 0.1)',
                            color: '#ff8888',
                            border: 'none',
                            padding: '12px',
                            borderRadius: '8px',
                            width: '100%',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontWeight: 600
                        }}
                    >
                        Sign Out
                    </button>
                </form>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
                {children}
            </main>
        </div>
    );
}
