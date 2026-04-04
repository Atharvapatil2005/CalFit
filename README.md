# CalFit



CalFit is an AI-powered calorie tracker designed to help users achieve their health goals. The app provides meal suggestions, calorie tracking, and an AI-integrated meal scanner for seamless nutrition monitoring.

## Features

- **AI-Powered Chat Assistant**: Get personalized meal suggestions and nutrition advice
- **Meal Tracker**: Log meals and track macros (protein, carbs, fats, fiber)
- **Progress Tracking**: Visual representation of daily calorie and protein goals
- **User Profile**: Customize your health goals and activity level

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/calfit.git
   cd calfit
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   - Create a `.env` file in the root directory
   - Add your Supabase credentials:
     ```
     SUPABASE_URL=https://your-project-id.supabase.co
     SUPABASE_ANON_KEY=your-supabase-anon-key
     EAS_PROJECT_ID=your-eas-project-id
     ```

4. Start the development server
   ```
   npm start
   ```

5. Run on your device or emulator
   - Press `i` for iOS
   - Press `a` for Android
   - Press `w` for web

## Project Structure

```
calfit/
├── app/                      # Expo Router app directory
│   ├── (auth)/              # Authentication routes
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/              # Main app tabs
│   │   ├── dashboard.tsx
│   │   ├── meals.tsx
│   │   ├── chat.tsx
│   │   └── profile.tsx
│   └── _layout.tsx          # Root layout
├── src/
│   ├── components/          # Reusable components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API and external services
│   ├── utils/              # Helper functions
│   ├── constants/          # App constants
│   └── types/              # TypeScript types
├── assets/                 # Static assets
└── docs/                   # Documentation
```

## Tech Stack

- **Frontend**: React Native with TypeScript, Expo, and Expo Router
- **Backend/Database**: Supabase
- **UI Framework**: React Native Paper
- **AI Processing**: DeepSeek

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
