# Prompt for Cursor Background Agent: Boutique-Tailor Marketplace Mobile App

## Project Name

Boutique-Tailor Marketplace

## Objective

Build a cross-platform mobile application (iOS and Android) using Expo React Native for a subscription-based marketplace connecting boutiques and tailors in India. Boutiques post job listings, and tailors apply with profiles. Access to job details and tailor contacts is restricted to paid subscribers via Razorpay. The app should be user-friendly, scalable, and deployable within 3–5 months.

## Tech Stack

- **Frontend**: Expo React Native with TypeScript for cross-platform mobile development (iOS and Android).
- **Styling**: Tailwind CSS via `nativewind` for responsive, modern UI.
- **Backend**: Supabase (PostgreSQL) for database, authentication, and file storage (e.g., tailor portfolios).
- **Payment Gateway**: Razorpay for subscription payments (India-specific).
- **Location Services**: Google Maps API via `react-native-maps` for location-based search (e.g., finding tailors by city).
- **Real-Time Chat**: Supabase Realtime for in-app messaging (or Firebase if simpler).
- **State Management**: Zustand or Redux Toolkit for managing app state.
- **Version Control**: GitHub for repository management and Cursor integration.
- **Deployment**: Expo EAS (Expo Application Services) for building and distributing APKs (Android) and IPAs (iOS); use TestFlight (iOS) and Firebase App Distribution (Android) for testing.
- **Cursor-Specific**: Use `.cursor/environment.json` for environment setup, including `npm install` and Expo CLI commands.

## Core Features

1. **User Roles and Authentication**:
   - Two user types: Boutiques and Tailors.
   - Supabase Authentication for email/password and Google OAuth login.
   - Role-based access control (RBAC): Boutiques post jobs; tailors apply to jobs.
2. **Job Board**:
   - Boutiques create job listings (title, description, budget, location, deadline).
   - Tailors browse job titles (free) but need a subscription to view details or apply.
   - Search and filter jobs by location, budget, or skill type (e.g., embroidery, bridal wear).
3. **User Profiles**:
   - Tailor profiles: Upload portfolio (images/videos via Supabase Storage), skills, experience, location.
   - Boutique profiles: Business details, ratings, past job postings.
4. **Subscription System**:
   - Razorpay integration for monthly subscriptions (e.g., ₹500 basic, ₹1,500 premium).
   - Paywall: Non-subscribers see job titles; subscribers access details and apply/contact.
   - Subscription status management in user profile.
5. **In-App Messaging**:
   - Basic chat for boutiques and tailors to negotiate (Supabase Realtime or Firebase).
   - Messaging locked behind subscription.
6. **Ratings and Reviews**:
   - Post-job rating/review system for both parties.
   - Publicly visible ratings on profiles.
7. **Location-Based Search**:
   - Google Maps API via `react-native-maps` for filtering jobs/tailors by city (e.g., Delhi, Jaipur).
   - Map view to display nearby jobs/tailors.
8. **Admin Panel**:
   - Basic admin interface to verify users, resolve disputes, and monitor subscriptions.
   - Accessible only to admin users (role-based).

## Project Structure

- **Expo React Native Project**:
  - Folders: `/screens` (Home, Login, JobBoard, JobDetails, Profile, Subscription, Chat, Admin), `/components` (JobCard, ProfileCard, Paywall, ChatBubble), `/hooks` (useAuth, useJobs), `/services` (Supabase, Razorpay, Google Maps), `/constants` (colors, API keys).
  - Main entry: `App.tsx`.
  - Use `nativewind` for Tailwind CSS styling.
- **Backend (Supabase)**:
  - Tables: `users` (id, role, email, subscription_status), `jobs` (id, title, description, budget, location, posted_by), `applications` (job_id, tailor_id, status), `messages` (sender_id, receiver_id, content), `ratings` (from_id, to_id, score, comment).
  - Storage: Store tailor portfolio images/videos in Supabase Storage.
  - Authentication: Supabase Auth for user management.
- **API Integration**:
  - Supabase JavaScript client (`@supabase/supabase-js`) for CRUD operations.
  - Razorpay React Native SDK (`react-native-razorpay`) for subscriptions.
  - `react-native-maps` for location features.

## Development Requirements

- **Setup**:
  - Create a new Expo project: `npx create-expo-app@latest boutique-tailor-marketplace --template blank-typescript`.
  - Add dependencies in `package.json`:
    ```json
    {
      "dependencies": {
        "@supabase/supabase-js": "^2.45.4",
        "react-native-razorpay": "^2.2.0",
        "react-native-maps": "^1.7.1",
        "nativewind": "^2.0.11",
        "zustand": "^4.5.0",
        "@react-navigation/native": "^6.1.9",
        "@react-navigation/stack": "^6.3.20",
        "react-native-safe-area-context": "^4.7.4",
        "react-native-screens": "^3.27.0",
        "react-native-dotenv": "^3.4.9"
      },
      "devDependencies": {
        "@typescript-eslint/eslint-plugin": "^6.7.3",
        "eslint": "^8.50.0",
        "jest": "^29.7.0",
        "@testing-library/react-native": "^12.3.0"
      }
    }
    ```
  - Configure Tailwind CSS with `nativewind` (update `babel.config.js` and `tailwind.config.js`).
  - Configure `.cursor/environment.json`:
    ```json
    {
      "install": "npm install",
      "start": "expo start --clear",
      "terminals": [
        {
          "name": "Supabase",
          "command": "supabase start"
        },
        {
          "name": "Build Android",
          "command": "expo build:android -t apk"
        },
        {
          "name": "Build iOS",
          "command": "expo build:ios -t simulator"
        }
      ]
    }
    ```
  - Store secrets (Supabase keys, Razorpay key, Google Maps API key) in `.env` using `react-native-dotenv`.
  - Initialize GitHub repository and push initial code.
- **Coding Standards**:
  - Use ESLint and Prettier for code quality (`npx eslint --init` and `npx prettier --write .`).
  - Follow React Native best practices (e.g., component composition, hooks).
  - Ensure accessibility (e.g., `accessibilityLabel` for UI elements).
  - Write unit tests for critical components (e.g., JobCard, Paywall) using `@testing-library/react-native`.
- **GitHub Integration**:
  - Create branches for each task (e.g., `feat/auth`, `feat/job-board`).
  - Submit pull requests with release-please format (e.g., `feat: implement job board`).
  - Ensure tests pass before PR submission.

## Tasks for Cursor Background Agent

1. **Setup Project**:
   - Initialize Expo React Native project with TypeScript and `nativewind`.
   - Configure Supabase client and authentication.
   - Set up `.cursor/environment.json` and `.env` for secrets.
   - Create GitHub repository and push initial code.
   - Branch: `setup/project-init`.
2. **Build Authentication**:
   - Implement Supabase Auth for email/password and Google OAuth in `screens/Login.tsx` and `screens/Signup.tsx`.
   - Create role-based logic (boutique/tailor) in `services/auth.ts`.
   - Build Login/Signup screens with Tailwind CSS (`nativewind`).
   - Branch: `feat/auth`.
3. **Develop Job Board**:
   - Create `screens/JobBoard.tsx` with FlatList of `components/JobCard.tsx`.
   - Implement search/filter functionality (location, budget, skill) using `useState` and `useEffect`.
   - Add paywall logic: Non-subscribers see job titles; subscribers see details (`components/Paywall.tsx`).
   - Build `screens/JobDetails.tsx` with apply button for tailors.
   - Branch: `feat/job-board`.
4. **User Profiles**:
   - Create `screens/Profile.tsx` for boutiques and tailors.
   - Implement portfolio upload (images/videos) using Supabase Storage in `services/storage.ts`.
   - Add edit profile form with validation in `components/ProfileForm.tsx`.
   - Branch: `feat/profiles`.
5. **Subscription System**:
   - Integrate Razorpay (`react-native-razorpay`) for subscription payments in `screens/Subscription.tsx`.
   - Create subscription status checks in `services/subscription.ts`.
   - Build paywall UI component (`components/Paywall.tsx`) to restrict access.
   - Branch: `feat/subscriptions`.
6. **Chat System**:
   - Implement in-app messaging using Supabase Realtime in `screens/Chat.tsx`.
   - Restrict messaging to subscribers via paywall logic.
   - Branch: `feat/chat`.
7. **Location-Based Search**:
   - Integrate `react-native-maps` for location filters in `components/MapView.tsx`.
   - Add map view to display jobs/tailors by city in `screens/JobBoard.tsx`.
   - Branch: `feat/location`.
8. **Ratings and Reviews**:
   - Create rating/review system in `components/RatingForm.tsx`.
   - Display ratings on profiles in `screens/Profile.tsx`.
   - Branch: `feat/ratings`.
9. **Admin Panel**:
   - Build admin interface in `screens/AdminDashboard.tsx` for user verification, dispute resolution, and subscription monitoring.
   - Restrict access to admin role.
   - Branch: `feat/admin`.
10. **Testing and Deployment**:
    - Write unit tests for `JobCard`, `Paywall`, and `ProfileForm` using `@testing-library/react-native`.
    - Build and deploy via Expo EAS: `expo build:android -t apk` and `expo build:ios -t simulator`.
    - Distribute via TestFlight and Firebase App Distribution.
    - Branch: `feat/testing-deployment`.

## Agent Instructions

- Break tasks into manageable steps and execute sequentially.
- Create a new GitHub branch for each task (e.g., `feat/auth`).
- Generate pull requests with clear descriptions and release-please format.
- Check for linter errors (ESLint) and fix automatically.
- Run unit tests before submitting PRs.
- If errors occur, analyze and fix autonomously; summarize changes in PR.
- Use `@` to reference files or symbols in the codebase (e.g., `@components/JobCard.tsx`).
- If unclear, prioritize simplicity and follow Expo/React Native best practices.
- Enable privacy mode to ensure code is not used for training.

## Expected Outcome

- A fully functional MVP with authentication, job board, profiles, subscriptions, chat, and admin panel.
- Deployable APKs (Android) and IPAs (iOS) via Expo EAS.
- Codebase with clean structure, tests, and PRs for review.
- Development completed in 15–20 hours of agent runtime, assuming iterative fixes.
