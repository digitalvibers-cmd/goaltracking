# 🎯 Goal Tracker

A modern, feature-rich goal tracking application built with Next.js, Supabase, and Google Calendar integration.

## ✨ Features

- **Goal Management**: Create, track, and manage your personal, business, health, and education goals
- **Metrics Tracking**: Define and monitor quantifiable metrics for each goal
- **Activity Planning**: Schedule activities and tasks to achieve your goals
- **Google Calendar Integration**: Sync your activities with Google Calendar
- **Real-time Dashboard**: View your progress with live statistics and activity feeds
- **Google OAuth**: Seamless authentication with Google
- **Row Level Security**: Secure data isolation for multi-user support

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: CSS with custom design system
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Calendar**: Google Calendar API
- **Authentication**: Supabase Auth (Email/Password + Google OAuth)

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account
- Google Cloud Platform account (for OAuth and Calendar API)

## 🛠️ Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd goal-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the database schema from `schema.sql` in the SQL Editor
3. Get your project URL and anon key from Project Settings > API

### 4. Set up Google OAuth & Calendar API

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/callback` (development)
   - Your production URL + `/auth/callback`

### 5. Configure environment variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

## 📁 Project Structure

```
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── auth/                 # OAuth callback
│   │   ├── dashboard/            # Dashboard pages
│   │   │   ├── calendar/         # Calendar view
│   │   │   └── goals/            # Goals management
│   │   └── login/                # Authentication pages
│   ├── components/               # React components
│   │   └── dashboard/            # Dashboard-specific components
│   └── lib/                      # Utilities and helpers
│       ├── supabase/             # Supabase client setup
│       └── google-calendar.ts    # Google Calendar integration
├── schema.sql                    # Database schema
└── README.md
```

## 🔐 Security

- Row Level Security (RLS) policies ensure users can only access their own data
- OAuth tokens are securely stored in Supabase Auth
- Environment variables protect sensitive credentials

## 📝 Database Schema

The app uses four main tables:

- **profiles**: User profile data
- **goals**: User goals with categories and deadlines
- **metrics**: Quantifiable metrics for tracking goal progress
- **activities**: Scheduled tasks and activities linked to goals

See `schema.sql` for the complete schema with RLS policies.

## 🎨 Features in Detail

### Dashboard
- Overview with active goals count
- Pending activities counter
- Monthly achievement tracker

### Goals
- Create goals with categories (Personal, Business, Health, Education, Other)
- Set deadlines and descriptions
- Track status (Active, Completed, On Hold)

### Metrics
- Define custom metrics (e.g., "Money Saved" in EUR)
- Set target values and track current progress
- Visual progress indicators

### Activities
- Schedule one-time or recurring activities
- Sync with Google Calendar
- Mark activities as completed
- Attach activities to specific goals

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

