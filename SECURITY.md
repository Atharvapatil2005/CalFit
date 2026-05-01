# Security Policy

## Reporting a Vulnerability
If you discover a security issue, please report it by opening an issue or contacting the developer.

## Data Handling

CalFit handles user health-related data such as:
- Food logs
- Calorie and macro tracking
- User account information

### Security Measures
- Authentication is handled via Supabase
- Row Level Security (RLS) is used to restrict access to user data
- API keys are stored securely using environment variables
- Sensitive data is not exposed to unauthorized users

## Limitations
- This is a student project and not intended for production-level healthcare use
- Users should avoid entering highly sensitive personal or medical information

## Scope
This policy applies to:
- Backend (Supabase + APIs)
- Frontend (React Native app)
- Third-party integrations (Nutritionix API, OpenRouter)
