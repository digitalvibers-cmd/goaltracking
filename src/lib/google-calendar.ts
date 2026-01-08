"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";

/**
 * Sync an activity to Google Calendar
 * Requires the user to be logged in with Google OAuth and have granted calendar scopes
 */
export async function syncActivityToCalendar(activityId: string, goalId: string) {
    const supabase = await createClient();

    // Get the current session to access provider_token
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.provider_token) {
        return {
            error: "Google Calendar access not available. Please login with Google and grant calendar permissions."
        };
    }

    // Get the activity details
    const { data: activity } = await supabase
        .from("activities")
        .select("*, goals(title)")
        .eq("id", activityId)
        .single();

    if (!activity) {
        return { error: "Activity not found" };
    }

    // Create calendar event
    const event = {
        summary: activity.title,
        description: `Goal: ${activity.goals?.title}\n\n${activity.description || ""}`,
        start: {
            dateTime: activity.scheduled_at || new Date().toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
            // Default to 1 hour duration
            dateTime: activity.scheduled_at
                ? new Date(new Date(activity.scheduled_at).getTime() + 60 * 60 * 1000).toISOString()
                : new Date(Date.now() + 60 * 60 * 1000).toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        reminders: {
            useDefault: false,
            overrides: [
                { method: "popup", minutes: 30 }
            ]
        }
    };

    // Handle recurring events
    if (activity.is_recurring && activity.recurrence_pattern) {
        // Convert simple pattern to RRULE (simplified)
        // Full implementation would parse "Mon, Wed, Fri" etc.
        event.recurrence = [`RRULE:FREQ=WEEKLY;COUNT=12`];
    }

    try {
        const response = await fetch(`${GOOGLE_CALENDAR_API}/calendars/primary/events`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${session.provider_token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(event)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Google Calendar API Error:", errorData);
            return { error: errorData.error?.message || "Failed to sync with Google Calendar" };
        }

        const createdEvent = await response.json();

        // Store the calendar event ID for future reference
        await supabase
            .from("activities")
            .update({ google_calendar_event_id: createdEvent.id })
            .eq("id", activityId);

        revalidatePath(`/dashboard/goals/${goalId}`);

        return { success: true, eventId: createdEvent.id };
    } catch (error) {
        console.error("Calendar sync error:", error);
        return { error: "Failed to connect to Google Calendar" };
    }
}

/**
 * Check if the current user has Google Calendar access
 */
export async function checkCalendarAccess() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    return {
        hasAccess: !!session?.provider_token,
        provider: session?.user?.app_metadata?.provider
    };
}
