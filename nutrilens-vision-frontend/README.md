# NutriLens Vision - Frontend

AI-powered nutrition tracking application that transforms meal photographs into instant nutritional insights.

## Features

- 📸 **Photo-based Food Analysis** - Snap a photo of your meal for instant nutritional breakdown
- 🎯 **Personalized Goals** - Set and track your health and nutrition goals
- 📊 **Progress Tracking** - Monitor your daily macro and calorie intake
- 🍽️ **Meal Suggestions** - Get AI-powered meal recommendations based on your remaining macros
- 🥗 **Health Considerations** - Account for allergies and medical conditions

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn/UI
- **State Management**: TanStack Query (React Query)
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks
├── integrations/    # External service integrations (Supabase)
├── lib/             # Utility functions
├── pages/           # Page components
└── main.tsx         # App entry point
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Edge Functions

The project includes Supabase Edge Functions for AI-powered features:

- `suggest-meals` - Generates meal suggestions based on remaining macros

## License

This project is part of the NutriLens Vision AI nutrition tracking system.
