# Boutique Tailor Marketplace

A cross-platform mobile application (iOS and Android) built with Expo React Native for a subscription-based marketplace connecting boutiques and tailors in India.

## Features

### Core Features

- **User Authentication**: Email/password and role-based authentication (Boutique/Tailor/Admin)
- **Job Board**: Browse and apply to job listings with search and filter functionality
- **Subscription System**: Paywall-based access control with Razorpay integration
- **User Profiles**: Manage profiles and portfolios for both boutiques and tailors
- **Real-time Chat**: In-app messaging system (coming soon)
- **Location-based Search**: Find jobs and users by location
- **Admin Dashboard**: User verification, dispute resolution, and analytics

### Subscription Plans

- **Free Plan**: Basic access to job titles only
- **Basic Plan** (₹500/month): Access to job details, apply to jobs, basic messaging
- **Premium Plan** (₹1,500/month): All basic features plus priority listings, advanced messaging, portfolio showcase

## Tech Stack

- **Frontend**: Expo React Native with TypeScript
- **Styling**: Tailwind CSS via nativewind
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Payment Gateway**: Razorpay (India-specific)
- **State Management**: Zustand
- **Navigation**: React Navigation Stack
- **Maps**: React Native Maps (coming soon)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Supabase account
- Razorpay account (for payments)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd boutique-tailor-marketplace
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# App Configuration
APP_ENV=development
```

### 4. Supabase Setup

1. Create a new Supabase project
2. Set up the following tables in your Supabase database:

```sql
-- Users table
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('boutique', 'tailor', 'admin')) NOT NULL,
  subscription_status TEXT CHECK (subscription_status IN ('free', 'basic', 'premium')) DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget INTEGER NOT NULL,
  location TEXT NOT NULL,
  deadline DATE NOT NULL,
  posted_by UUID REFERENCES users(id) NOT NULL,
  status TEXT CHECK (status IN ('open', 'in_progress', 'completed')) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) NOT NULL,
  tailor_id UUID REFERENCES users(id) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES users(id) NOT NULL,
  receiver_id UUID REFERENCES users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings table
CREATE TABLE ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_id UUID REFERENCES users(id) NOT NULL,
  to_id UUID REFERENCES users(id) NOT NULL,
  score INTEGER CHECK (score >= 1 AND score <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. Enable Row Level Security (RLS) and create appropriate policies
4. Set up Supabase Storage for portfolio uploads

### 5. Run the Application

```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

## Project Structure

```
boutique-tailor-marketplace/
├── App.tsx                 # Main application entry point
├── components/             # Reusable UI components
│   ├── JobCard.tsx        # Job listing card component
│   └── Paywall.tsx        # Subscription paywall component
├── screens/               # Application screens
│   ├── LoginScreen.tsx    # User authentication
│   ├── SignupScreen.tsx   # User registration
│   ├── HomeScreen.tsx     # Main dashboard
│   ├── JobBoardScreen.tsx # Job listings
│   ├── JobDetailsScreen.tsx # Job details and application
│   ├── ProfileScreen.tsx  # User profile management
│   ├── SubscriptionScreen.tsx # Subscription plans
│   ├── ChatScreen.tsx     # Messaging (placeholder)
│   └── AdminDashboardScreen.tsx # Admin panel
├── services/              # Business logic and API services
│   ├── supabase.ts       # Supabase client configuration
│   ├── auth.ts           # Authentication service
│   └── store.ts          # Zustand state management
├── constants/             # Application constants
│   ├── colors.ts         # Color definitions
│   └── api.ts            # API configuration
├── hooks/                 # Custom React hooks
└── assets/               # Static assets
```

## Development Workflow

### Adding New Features

1. Create a new branch: `git checkout -b feat/feature-name`
2. Implement the feature following the existing code patterns
3. Add tests if applicable
4. Submit a pull request with a clear description

### Code Style

- Use TypeScript for all new code
- Follow React Native best practices
- Use Tailwind CSS classes via nativewind
- Implement proper error handling
- Add loading states for async operations

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Building for Production

### Android

```bash
# Build APK
expo build:android -t apk

# Build AAB for Play Store
expo build:android -t app-bundle
```

### iOS

```bash
# Build for iOS simulator
expo build:ios -t simulator

# Build for App Store
expo build:ios -t archive
```

## Deployment

### Android

1. Build the APK/AAB using Expo EAS
2. Upload to Google Play Console
3. Configure Firebase App Distribution for testing

### iOS

1. Build the IPA using Expo EAS
2. Upload to App Store Connect
3. Configure TestFlight for testing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

## Roadmap

### Phase 1 (Current)

- ✅ Basic authentication and user management
- ✅ Job board with search and filtering
- ✅ Subscription system with paywall
- ✅ User profiles and basic UI

### Phase 2 (Next)

- 🔄 Real-time chat implementation
- 🔄 Portfolio upload and management
- 🔄 Location-based search with maps
- 🔄 Push notifications

### Phase 3 (Future)

- 📅 Advanced analytics and reporting
- 📅 Multi-language support
- 📅 Advanced payment features
- 📅 Mobile app optimization
