# SylorLabs Authentication Portal

A sleek, futuristic authentication system for the Zenith DAW desktop application, featuring a "Neon Noir" design aesthetic.

## Features

- **Login & Signup Pages**: Modern, glassmorphic UI with neon cyan and magenta accents
- **Google OAuth Integration**: One-click sign-in with Google
- **Password Validation**: Real-time password strength indicator
- **Desktop App Integration**: Seamless token-based authentication with redirect URI support
- **Responsive Design**: Perfect on desktop and webview windows
- **Security**: JWT tokens, bcrypt password hashing, input validation

## Design Aesthetic ("Neon Noir")

- **Background**: Deep noir (#09090b)
- **Glassmorphism**: Translucent panels with 16px backdrop blur
- **Accents**: Neon Cyan (#00f3ff) and Magenta (#ff00ff)
- **Typography**: Inter/Outfit fonts with weighted headings
- **Animations**: Subtle fade-in, slide-up, and glow effects
- **Feel**: Premium, futuristic, professional audio software brand

## Routes

### `/login`
- Username/Email and password authentication
- Google OAuth sign-in
- Redirect URI support for desktop app integration
- "Forgot Password?" and "Sign up" links

### `/signup`
- Username, email, password, and confirm password fields
- Real-time password strength validation
- Auto-login after successful registration
- Link to login page

## API Endpoints

### `POST /api/auth/login`
Login with username/email and password.

**Request Body:**
```json
{
  "emailOrUsername": "user@example.com",
  "password": "SecurePass123",
  "redirectUri": "zenith://oauth/callback" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "redirectUrl": "zenith://oauth/callback?token=...",
  "user": {
    "id": "abc123",
    "username": "user",
    "email": "user@example.com"
  }
}
```

### `POST /api/auth/signup`
Create a new user account.

**Request Body:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "abc123",
    "username": "newuser",
    "email": "user@example.com"
  }
}
```

### `GET /api/auth/google?redirect_uri=<uri>`
Initiates Google OAuth flow.

### `GET /api/auth/google/callback?code=<code>&state=<redirect_uri>`
Handles Google OAuth callback.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

Dependencies installed:
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation/verification
- `@types/bcryptjs` & `@types/jsonwebtoken` - TypeScript types

### 2. Configure Environment Variables

Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

Update the following variables:

```env
# Required: Change this to a secure random string
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Base URL for your application
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Google OAuth (Optional - only needed if using Google sign-in)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

### 3. Set Up Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
6. Copy Client ID and Client Secret to `.env.local`

### 4. Run Development Server

```bash
npm run dev
```

Visit:
- Login: http://localhost:3000/login
- Signup: http://localhost:3000/signup

## Desktop App Integration

The authentication portal supports seamless integration with the Zenith DAW desktop application.

### Flow:

1. **Desktop app opens webview** to:
   ```
   http://localhost:3000/login?redirect_uri=zenith://oauth/callback
   ```

2. **User authenticates** via login/signup/Google OAuth

3. **Portal redirects back** to desktop app with token:
   ```
   zenith://oauth/callback?token=eyJhbGciOiJIUzI1NiIs...
   ```

4. **Desktop app** captures the token and stores it for API requests

### Supported Redirect URI Schemes:
- Custom protocol: `zenith://oauth/callback`
- Localhost callback: `http://127.0.0.1:8888/callback`
- Any valid URI

## File Structure

```
app/
├── api/
│   └── auth/
│       ├── login/route.ts          # Login endpoint
│       ├── signup/route.ts         # Signup endpoint
│       └── google/
│           ├── route.ts            # Google OAuth initiation
│           └── callback/route.ts   # Google OAuth callback
├── login/page.tsx                  # Login page
├── signup/page.tsx                 # Signup page
└── globals.css                     # Neon Noir styles

lib/
├── auth.ts                         # Authentication utilities
└── validation.ts                   # Input validation

components/
└── (existing components)
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds of 10
- **JWT Tokens**: 7-day expiration, signed with secret key
- **Input Validation**: 
  - Email format validation
  - Password strength requirements (8+ chars, uppercase, lowercase, numbers)
  - Username validation (3-20 chars, alphanumeric + underscore)
- **HTTPS Ready**: Configure for production with proper SSL

## Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Recommended: Special characters for extra strength

## Production Deployment

### Important Security Steps:

1. **Change JWT_SECRET** to a cryptographically secure random string:
   ```bash
   openssl rand -base64 32
   ```

2. **Update NEXT_PUBLIC_BASE_URL** to your production domain

3. **Configure Google OAuth** redirect URI for production domain

4. **Use HTTPS** in production (required for OAuth)

5. **Replace in-memory user storage** with a real database:
   - PostgreSQL (recommended)
   - MongoDB
   - Supabase
   - Firebase

### Database Integration (Future Enhancement)

The current implementation uses in-memory storage for demonstration. For production, replace the user storage in `lib/auth.ts` with database calls:

```typescript
// Example with Prisma
export async function createUser(username: string, email: string, password: string) {
  const hashedPassword = await hashPassword(password);
  return prisma.user.create({
    data: { username, email, password: hashedPassword }
  });
}
```

## Customization

### Colors
Edit `tailwind.config.ts` to customize the neon colors:
```typescript
colors: {
  "neon-cyan": "#00f3ff",      // Change cyan accent
  "neon-magenta": "#ff00ff",   // Change magenta accent
  "noir-bg": "#09090b",        // Change background
}
```

### Fonts
Update `tailwind.config.ts` to use different fonts:
```typescript
fontFamily: {
  sans: ['YourFont', 'system-ui', 'sans-serif'],
}
```

### Animations
Modify the animation keyframes in the page components or add global animations to `globals.css`.

## Troubleshooting

### Google OAuth Not Working
- Verify redirect URI matches exactly in Google Console
- Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set
- Ensure you're using HTTPS in production

### JWT Token Issues
- Verify JWT_SECRET is set and consistent
- Check token expiration (default 7 days)
- Ensure token is being passed correctly in Authorization header

### Styling Issues
- Clear browser cache
- Rebuild: `npm run build`
- Check Tailwind config is correct

## License

© 2024 SylorLabs. All rights reserved.
