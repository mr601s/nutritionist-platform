# Nutritionist Platform

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Authentication Setup

This project includes a complete authentication system with email verification for customers and admin invite system.

### Quick Start

#### 1. Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### 2. Supabase Setup

**a) Run the migration:**

```bash
# Navigate to your Supabase SQL Editor and run:
supabase/migrations/001_create_profiles_and_invites.sql
```

Or if using Supabase CLI:

```bash
supabase db push
```

**b) Configure Email Settings:**

In your Supabase dashboard:
1. Go to `Authentication` > `Email Templates`
2. Customize the confirmation email template
3. Enable email confirmations under `Authentication` > `Providers` > `Email`
4. Set `Site URL` to your domain (e.g., `http://localhost:3000`)
5. Add `http://localhost:3000/auth/callback` to redirect URLs

#### 3. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

#### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Authentication Features

#### Customer Sign-Up
- Customers can register directly via `/auth/signup`
- Email verification is required (Supabase sends confirmation email)
- Automatically creates profile with `customer` role

#### Admin Sign-Up
- Admins can only be created via invite link
- Use the `sendAdminInvite()` server action to generate invite
- Invite links expire after 7 days
- Email verification is required
- Automatically creates profile with `admin` role

#### Server Actions Available

```typescript
import { signUp, login, logout, sendAdminInvite, signUpAdmin } from '@/auth/actions'

// Customer registration
await signUp(formData)

// Admin invitation (requires authenticated admin)
await sendAdminInvite('newadmin@example.com')

// Admin registration with invite token
await signUpAdmin(formData, inviteToken)

// Login
await login(formData)

// Logout
await logout()
```

### Database Schema

#### Profiles Table
- `id` (uuid): User ID from auth.users
- `email` (text): User email
- `full_name` (text): User's full name
- `role` (text): Either 'customer' or 'admin'
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### Admin Invites Table
- `id` (uuid): Invite ID
- `email` (text): Invited email address
- `token` (text): Unique invite token
- `invited_by` (uuid): Admin who sent invite
- `used` (boolean): Whether invite was used
- `expires_at` (timestamp): Expiration date
- `created_at` (timestamp)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
