import { login, signup, signInWithGoogle } from "./actions";

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ message: string }>;
}) {
    const { message } = await searchParams;

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                padding: "1rem",
            }}
        >
            <div
                className="glass-panel"
                style={{
                    width: "100%",
                    maxWidth: "400px",
                    padding: "2.5rem",
                }}
            >
                <h1
                    style={{
                        textAlign: "center",
                        marginBottom: "2rem",
                        background: "linear-gradient(to right, #fff, #a0a5b9)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontSize: "2rem",
                    }}
                >
                    Welcome Back
                </h1>

                {/* Google OAuth - separate form to avoid HTML5 validation */}
                <form style={{ marginBottom: "1.5rem" }}>
                    <button
                        formAction={signInWithGoogle}
                        style={{
                            width: "100%",
                            background: "linear-gradient(135deg, #4285f4, #34a853)",
                            border: "none",
                            color: "white",
                            padding: "12px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            transition: "all 0.2s",
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="white" />
                            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="white" />
                            <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="white" />
                            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="white" />
                        </svg>
                        Continue with Google
                    </button>
                </form>

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1.5rem"
                }}>
                    <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>or</span>
                    <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
                </div>

                <form style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div>
                        <label
                            htmlFor="email"
                            style={{
                                display: "block",
                                marginBottom: "0.5rem",
                                fontSize: "0.9rem",
                                color: "var(--text-secondary)",
                            }}
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="you@example.com"
                            style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid rgba(255,255,255,0.1)",
                                background: "rgba(0,0,0,0.2)",
                                color: "white",
                                outline: "none",
                            }}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="fullName"
                            style={{
                                display: "block",
                                marginBottom: "0.5rem",
                                fontSize: "0.9rem",
                                color: "var(--text-secondary)",
                            }}
                        >
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            placeholder="John Doe"
                            style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid rgba(255,255,255,0.1)",
                                background: "rgba(0,0,0,0.2)",
                                color: "white",
                                outline: "none",
                            }}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            style={{
                                display: "block",
                                marginBottom: "0.5rem",
                                fontSize: "0.9rem",
                                color: "var(--text-secondary)",
                            }}
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "1px solid rgba(255,255,255,0.1)",
                                background: "rgba(0,0,0,0.2)",
                                color: "white",
                                outline: "none",
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                        <button formAction={login} className="btn-primary">
                            Sign In
                        </button>
                        <button
                            formAction={signup}
                            style={{
                                background: "transparent",
                                border: "1px solid rgba(255,255,255,0.2)",
                                color: "var(--text-secondary)",
                                padding: "12px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                transition: "all 0.2s",
                            }}
                        >
                            Sign Up
                        </button>
                    </div>

                    {message && (
                        <div
                            style={{
                                padding: "1rem",
                                background: "rgba(255,50,50,0.1)",
                                border: "1px solid rgba(255,50,50,0.2)",
                                borderRadius: "8px",
                                color: "#ff8888",
                                fontSize: "0.9rem",
                                textAlign: "center",
                            }}
                        >
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
