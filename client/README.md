┌─────────────┐
│   Browser   │
│  (React)    │
└──────┬──────┘
       │
       │ 1. User enters email/password
       │    Login.jsx (handleLogin)
       ▼3
┌─────────────────────────┐
│   AuthContext.login()   │
│   (Supabase Client)     │
└──────┬──────────────────┘
       │
       │ 2. Call supabase.auth.signInWithPassword()
       │    - Sends credentials to Supabase
       ▼
┌──────────────────────┐
│   Supabase Auth      │
│   (Cloud Service)    │
└──────┬───────────────┘
       │
       │ 3. Validates password hash
       │    Returns: { session, user }
       │    - access_token (JWT)
       │    - refresh_token
       │    - expires_in (3600s)
       ▼
┌─────────────────────────┐
│   AuthContext           │
│   (Session Storage)     │
└──────┬──────────────────┘
       │
       │ 4. Store session in localStorage
       │    (Automatic via Supabase SDK)
       │    Set user state
       ▼
┌─────────────────────────┐
│   Login.jsx             │
│   (Verification Check)  │
└──────┬──────────────────┘
       │
       │ 5. Call axiosInstance.get("/auth/me")
       │    Authorization: Bearer <access_token>
       ▼
┌─────────────────────────┐
│   Express Backend       │
│   (authMiddleware)      │
└──────┬──────────────────┘
       │
       │ 6. verifyToken middleware:
       │    - Extract token from header
       │    - Validate with Supabase
       │    - Attach user to req.user
       ▼
┌─────────────────────────┐
│   AuthController.getMe  │
│   (Database Query)      │
└──────┬──────────────────┘
       │
       │ 7. Query user profile:
       │    - SELECT * FROM users WHERE uuid = ?
       │    - Get: role, status, full_name
       ▼
┌─────────────────────────┐
│   Response              │
└──────┬──────────────────┘
       │
       │ 8. Return user data:
       │    { user: { id, email, full_name, role, status } }
       ▼
┌─────────────────────────┐
│   Login.jsx             │
│   (Role-based Redirect) │
└──────┬──────────────────┘
       │
       │ 9. Check user.status === true
       │    ├─ If false → Show "pending approval"
       │    └─ If true → Redirect based on role
       ▼
┌─────────────────────────┐
│   Navigate              │
│   - Admin → /admin      │
│   - Others → /dashboard │
└─────────────────────────┘  

Data State Management
1. Supabase Session State
Location: localStorage (managed by Supabase SDK)
Stored Data:
{  access_token: "eyJhbGci...",  // JWT token (1 hour expiry)  refresh_token: "...",          // Used to get new access token  expires_at: 1234567890,        // Unix timestamp  expires_in: 3600,              // Seconds until expiry  token_type: "bearer",  user: {    id: "uuid-here",    email: "user@example.com",    user_metadata: {      full_name: "...",      role: "..."    }  }}
Persistence: Survives page refresh, browser close/reopen
2. React Auth Context State
Location: client/src/context/AuthContext.jsx
State Variables:
{  user: {    id: "uuid",    email: "user@example.com",    full_name: "John Doe",    role: "admin",    status: true  },  session: { /* Supabase session object */ },  loading: false,  isAuthenticated: true,  isAdmin: true}
State Flow:
App Load   ↓AuthProvider mounts   ↓useEffect runs   ↓supabase.auth.getSession()   ↓Session exists? ──NO──→ User stays logged out   ↓ YESFetch user profile from backend   ↓Set user state   ↓isAuthenticated = true   ↓Protected routes accessible
3. Auth State Listeners
Event Listeners:
supabase.auth.onAuthStateChange((event, session) => {  // Events: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, etc.    if (event === 'SIGNED_IN') {    fetchUserProfile(session.user.id, session.access_token);  }    if (event === 'SIGNED_OUT') {    setUser(null);  }    if (event === 'TOKEN_REFRESHED') {    // New token automatically stored  }});
Triggers:
Login success
Logout
Token auto-refresh
Tab sync (cross-tab auth state sync)
 

 ┌─────────────────────────┐
│   Access Token          │
│   - Expires: 1 hour     │
│   - Sent with requests  │
└──────┬──────────────────┘
       │
       │ Every API Request
       ▼
┌─────────────────────────┐
│   Axios Interceptor     │
│   (axiosInstance.js)    │
└──────┬──────────────────┘
       │
       │ Add header:
       │ Authorization: Bearer <token>
       ▼
┌─────────────────────────┐
│   Express Backend       │
│   (verifyToken)         │
└──────┬──────────────────┘
       │
       ├─ Valid → Process request
       │
       └─ 401 Error → Token expired
                ↓
┌─────────────────────────┐
│   Axios Interceptor     │
│   (Response Handler)    │
└──────┬──────────────────┘
       │
       │ Detect 401
       │ Call: supabase.auth.refreshSession()
       ▼
┌─────────────────────────┐
│   Supabase Auth         │
│   (Token Refresh)       │
└──────┬──────────────────┘
       │
       │ Exchange refresh_token
       │ for new access_token
       ▼
┌─────────────────────────┐
│   Retry Original        │
│   Request with New Token│
└─────────────────────────┘  

User navigates to /dashboard
   ↓
ProtectedRoute renders
   ↓
Check: loading? ──YES──→ Show loading spinner
   ↓ NO
Check: isAuthenticated? ──NO──→ Redirect to /login
   ↓ YES
Check: user.status === true? ──NO──→ Show "pending approval"
   ↓ YES
Check: requiredRole? ──NO──→ Render children
   ↓ YES
Check: user.role === requiredRole? ──NO──→ Show "access denied"
   ↓ YES
Render protected component  

// Frontend
const response = await axiosInstance.get("/users/pending");

// What happens:
1. Request interceptor runs:
   ↓
   Get session from Supabase
   ↓
   Add header: Authorization: Bearer <access_token>
   ↓
2. Send to backend: GET /api/users/pending
   ↓
3. Backend middleware chain:
   ↓
   verifyToken → Validate token with Supabase
   ↓
   requireRole("admin") → Check user role
   ↓
4. Controller executes:
   ↓
   UserController.getPendingUsers()
   ↓
5. Return response:
   ↓
   { users: [...] }  

User clicks logout
   ↓
AuthContext.logout()
   ↓
supabase.auth.signOut()
   ↓
Supabase clears localStorage
   ↓
Triggers: onAuthStateChange → SIGNED_OUT
   ↓
AuthContext sets:
   - user = null
   - session = null
   ↓
isAuthenticated = false
   ↓
ProtectedRoute detects no auth
   ↓
Redirect to /login 