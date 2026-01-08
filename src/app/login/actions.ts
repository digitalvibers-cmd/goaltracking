"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return redirect("/login?message=Could not authenticate user");
    }

    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function signInWithGoogle() {
    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback`,
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
            scopes: 'https://www.googleapis.com/auth/calendar'
        }
    });

    if (error) {
        return redirect("/login?message=Could not authenticate with Google");
    }

    if (data.url) {
        redirect(data.url);
    }
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;

    const origin = (await headers()).get("origin");

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
            emailRedirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        return redirect("/login?message=Could not authenticate user");
    }

    // Insert profile manually if trigger fails or just to be safe (optional, usually triggers handle this)
    if (data.user) {
        await supabase.from('profiles').upsert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            updated_at: new Date().toISOString()
        })
    }

    revalidatePath("/", "layout");
    redirect("/login?message=Check email to continue sign in process");
}

export async function signout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
}
