# CalFit Documentation

## Overview
CalFit is an AI-powered calorie tracking application designed to help users achieve their health and fitness goals. The app combines intelligent meal suggestions, comprehensive calorie tracking, and an AI-integrated meal scanner for seamless nutrition monitoring.

## Core Features

## Tech Stack
- Frontend: React Native with TypeScript, Expo, and Expo Router
- Backend/Database: Supabase
- UI Framework: React Native Paper
- AI Processing: DeepSeek

## Database Schema

### Users Table
```sql
users (
  id: uuid PRIMARY KEY,
  email: string UNIQUE,
  full_name: string,
  date_of_birth: date,
  height: decimal,
  weight: decimal,
  activity_level: enum('sedentary', 'lightly_active', 'moderately_active', 'very_active'),
  health_goal: enum('lose_weight', 'maintain_weight', 'gain_muscle'),
  preferred_units: enum('metric', 'imperial'),
  created_at: timestamp,
  updated_at: timestamp
)
```

### Meals Table
```sql
meals (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES users(id),
  name: string,
  calories: integer,
  protein: decimal,
  carbs: decimal,
  fats: decimal,
  fiber: decimal,
  portion_size: decimal,
  portion_unit: enum('g', 'oz', 'bowl', 'tbsp', 'cup'),
  meal_type: enum('breakfast', 'lunch', 'dinner', 'snack'),
  date: date,
  created_at: timestamp,
  image_url: string NULL
)
```

### Daily Goals Table
```sql
daily_goals (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES users(id),
  date: date,
  calorie_target: integer,
  protein_target: decimal,
  carbs_target: decimal,
  fats_target: decimal,
  created_at: timestamp
)
```

### Chat History Table
```sql
chat_history (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES users(id),
  message: text,
  is_ai: boolean,
  created_at: timestamp
)
```

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
│   │   ├── common/         # Shared components
│   │   ├── meals/          # Meal-related components
│   │   └── chat/           # Chat-related components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API and external services
│   │   ├── supabase.ts     # Supabase client
│   │   ├── ai.ts           # AI service
│   │   └── storage.ts      # Storage service
│   ├── utils/              # Helper functions
│   ├── constants/          # App constants
│   └── types/              # TypeScript types
├── assets/                 # Static assets
│   ├── images/
│   └── fonts/
├── docs/                   # Documentation
├── tests/                  # Test files
├── app.json               # Expo config
├── babel.config.js        # Babel config
├── tsconfig.json          # TypeScript config
└── package.json           # Dependencies
```

### 1. Welcome Screen
- **Clean UI**: Minimalist interface featuring the CalFit logo
- **Smooth Transitions**: Elegant animations between screens
- **Authentication**: Google Sign-in integration for secure access

### 2. User Profile Setup
Users provide essential information to personalize their experience:

#### Personal Information
- Full Name
- Date of Birth
- Height (cm/feet)
- Weight (kg/lbs)

#### Health Goals
- Weight Loss
- Weight Maintenance
- Muscle Gain

#### Activity Level
- Sedentary (little or no exercise)
- Lightly Active (1-3 days/week)
- Moderately Active (3-5 days/week)
- Very Active (6-7 days/week)

#### Unit Preferences
- Metric (kg, cm)
- Imperial (lbs, ft)

### 3. Main Dashboard

#### AI-Powered Chat Assistant
The intelligent assistant provides:
- Personalized meal suggestions
- Calorie adjustment recommendations
- Workout guidance
- Nutrition advice

#### Meal Tracker
Comprehensive meal logging capabilities:

##### Entry Methods
1. **Manual Input**
   - Food search functionality
   - Custom meal entry

2. **AI-Powered Food Scanner**
   - Camera-based food identification
   - Automatic portion size detection
   - Calorie calculation

##### Supported Measurements
- Grams
- Ounces
- Bowl
- Tablespoon
- Cup

#### Progress Tracking
- Daily calorie goal progress
- Macronutrient breakdown visualization
- Protein intake monitoring

#### Achievement System
- Motivational pop-ups for goal completion
- "Perfect Day" celebrations 🎉

### 4. Additional Features

#### User Customization
- Profile settings management
- Dark mode support
- Unit preference toggling

#### Analytics
- Weekly nutrition reports
- Monthly progress tracking

#### Future Enhancements
- Wearable device integration
- Premium custom meal plans

## Technical Notes
- The application is designed with a focus on user experience and intuitive navigation
- All features are optimized for both iOS and Android platforms
- Regular updates ensure the latest nutritional data and AI improvements

## Development Roadmap

### Phase 1: Project Setup and Authentication (Week 1)
1. **Initial Setup**
   - Initialize Expo project with TypeScript
   - Set up Supabase project
   - Configure environment variables
   - Install essential dependencies

2. **Authentication Flow**
   - Implement Google Sign-in
   - Create authentication screens (login/register)
   - Set up protected routes
   - Test authentication flow

### Phase 2: User Profile and Onboarding (Week 2)
1. **Profile Setup**
   - Create user profile form
   - Implement form validation
   - Set up Supabase user table
   - Add unit preference handling

2. **Onboarding Flow**
   - Design onboarding screens
   - Implement health goals selection
   - Add activity level selection
   - Create smooth navigation flow

### Phase 3: Core Features - Dashboard and Meal Tracking (Week 3)
1. **Dashboard Development**
   - Create dashboard layout
   - Implement calorie progress visualization
   - Add macronutrient breakdown charts
   - Set up daily goals tracking

2. **Meal Tracking**
   - Build meal entry form
   - Implement food search functionality
   - Add manual portion input
   - Create meal history view

### Phase 4: AI Integration (Week 4)
1. **Chat Assistant**
   - Set up DeepSeek AI integration
   - Create chat interface
   - Implement message history
   - Add meal suggestion functionality

2. **Food Scanner**
   - Implement camera integration
   - Add image processing
   - Create food recognition system
   - Build portion size estimation

### Phase 5: Analytics and Reports (Week 5)
1. **Progress Tracking**
   - Implement weekly reports
   - Add monthly analytics
   - Create progress visualizations
   - Set up goal achievement tracking

2. **Data Export**
   - Add data export functionality
   - Implement report generation
   - Create PDF export feature

### Phase 6: Polish and Optimization (Week 6)
1. **UI/UX Refinement**
   - Implement dark mode
   - Add animations and transitions
   - Optimize navigation flow
   - Enhance error handling

2. **Performance Optimization**
   - Optimize database queries
   - Implement caching
   - Reduce bundle size
   - Add offline support

### Phase 7: Testing and Deployment (Week 7)
1. **Testing**
   - Write unit tests
   - Perform integration testing
   - Conduct user acceptance testing
   - Fix bugs and issues

2. **Deployment**
   - Prepare app store assets
   - Configure production environment
   - Submit to app stores
   - Monitor initial release

### Development Guidelines
- Follow TypeScript best practices
- Write unit tests for critical features
- Document all API integrations
- Use atomic commits with clear messages
- Regular code reviews and quality checks

### Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start development server: `npm start`
5. Follow the phase-by-phase development plan
