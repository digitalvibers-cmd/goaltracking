"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
    const pathname = usePathname();

    const links = [
        { name: "Overview", href: "/dashboard" },
        { name: "My Goals", href: "/dashboard/goals" },
        { name: "Calendar", href: "/dashboard/calendar" },
        { name: "Settings", href: "/dashboard/settings" },
    ];

    return (
        <>
            {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        style={{
                            display: "block",
                            padding: "12px 16px",
                            borderRadius: "8px",
                            color: isActive ? "white" : "var(--text-secondary)",
                            background: isActive
                                ? "linear-gradient(90deg, rgba(100, 50, 255, 0.2), transparent)" // Subtle glow
                                : "transparent",
                            borderLeft: isActive ? "3px solid var(--color-primary)" : "3px solid transparent",
                            textDecoration: "none",
                            transition: "all 0.2s",
                            fontWeight: isActive ? 600 : 400,
                        }}
                    >
                        {link.name}
                    </Link>
                );
            })}
        </>
    );
}
