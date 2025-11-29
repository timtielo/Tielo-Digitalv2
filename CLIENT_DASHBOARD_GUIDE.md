# Client Dashboard Guide

## Overview

A comprehensive client dashboard for local businesses (electricians, plumbers, contractors) built with React, TypeScript, Supabase, and real-time capabilities.

## Features

### 1. Authentication
- Email/password authentication via Supabase Auth
- Protected routes that require login
- Session management with automatic persistence
- Logout functionality

### 2. Portfolio Management
- Create, read, update, and delete portfolio items
- Upload before/after images to Supabase Storage
- Categorize projects (Groepenkast, Laadpalen, Overig)
- Mark items as "featured"
- Real-time updates across all connected clients
- Image preview thumbnails in table view

### 3. Werkspot Data
- Manage Werkspot review statistics
- Track review count and average star rating
- Inline editing with real-time updates
- One record per user

### 4. Reviews
- Full CRUD operations for customer reviews
- Date tracking for each review
- Real-time synchronization
- Empty state for new users

### 5. Leads Management
- Read-only view of incoming leads
- Display contact information (name, phone, email, message)
- Sortable by name or date
- Statistics cards showing total leads, leads with email, leads with phone
- Real-time updates when new leads arrive

## Routes

- `/login` - Login page
- `/dashboard/portfolio` - Portfolio management
- `/dashboard/werkspot` - Werkspot statistics
- `/dashboard/reviews` - Customer reviews
- `/dashboard/leads` - Incoming leads (read-only)

## Database Schema

### portfolio_items
```sql
- id (uuid, PK)
- user_id (text, FK to auth.users)
- title (text)
- category (text)
- location (text)
- date (date)
- description (text, nullable)
- before_image (text, nullable)
- after_image (text, nullable)
- featured (boolean, default false)
- created_at (timestamptz)
- updated_at (timestamptz)
```

### werkspot_data
```sql
- id (uuid, PK)
- user_id (text, unique, FK to auth.users)
- reviewamount (integer, default 0)
- avgstars (float, default 0.0)
```

### reviews
```sql
- id (uuid, PK)
- user_id (text, FK to auth.users)
- name (text)
- review (text)
- date (date)
```

### leads
```sql
- id (uuid, PK)
- user_id (text, FK to auth.users)
- name (text)
- phone (text, nullable)
- email (text, nullable)
- message (text, nullable)
- date (timestamptz, default now())
```

## Security

### Row Level Security (RLS)
All tables have RLS enabled with policies that ensure:
- Users can only access their own data
- All queries are automatically filtered by `user_id = auth.uid()`
- No user can view or modify another user's data

### Storage Security
Portfolio images are stored in the `portfolio-images` bucket with policies that:
- Only authenticated users can upload
- Files are organized by user_id folders
- Users can only access their own images

## Real-time Features

All dashboard pages use Supabase real-time subscriptions to:
- Automatically update when data changes in the database
- Show updates instantly without page refresh
- Synchronize across multiple browser tabs/windows

## Creating Test Users

To create a test user for development:

```javascript
// Use Supabase Dashboard or this code
import { supabase } from './lib/supabase/client';

const { data, error } = await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'securepassword123',
});
```

## Components Used

### UI Components (shadcn-style)
- Button - For actions and navigation
- Card - Container for content sections
- Input - Text input fields
- Textarea - Multi-line text input
- Select - Dropdown selections
- Label - Form field labels
- Dialog - Modal overlays for forms
- Table - Data tables with sorting

### Dashboard Components
- DashboardLayout - Main layout with sidebar navigation
- ProtectedRoute - HOC for authentication protection
- AuthProvider - Context provider for auth state

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Supabase (Auth, Database, Storage, Realtime)
- **Build Tool**: Vite

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Future Enhancements

- [ ] Add analytics dashboard with charts
- [ ] Email notifications for new leads
- [ ] Export data to CSV/PDF
- [ ] Bulk operations for portfolio items
- [ ] Search and filter functionality
- [ ] Image optimization and compression
- [ ] Multi-language support
- [ ] Mobile app version
