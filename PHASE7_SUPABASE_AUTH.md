# Phase 7: Supabase Authentication Implementation

## Overview
Replace hardcoded login credentials with Supabase Authentication while maintaining current UI/UX patterns.

---

## Step 1: Create Auth Service

**File**: `services/auth.ts`

```typescript
import { supabase } from '../lib/supabase';

export const authService = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  onAuthStateChange(callback: (isAuthenticated: boolean) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(!!session);
    });
  }
};
```

---

## Step 2: Update Login Component

**File**: `components/Login.tsx`

Replace the `handleSubmit` function:

```typescript
// OLD CODE (lines 28-31):
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (username === 'Santiagoavila' && password === 'Pasantia2026') {
    onLogin();
  } else {
    setError('Credenciales incorrectas. Verifique e intente nuevamente.');
  }
};

// NEW CODE:
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');
  
  try {
    const { authService } = await import('../services/auth');
    await authService.signIn(username, password);
    onLogin();
  } catch (err) {
    setError('Credenciales incorrectas. Verifique e intente nuevamente.');
    console.error('Login error:', err);
  } finally {
    setIsLoading(false);
  }
};
```

Add loading state to button:

```typescript
// In the submit button (around line 95):
<button
  type="submit"
  disabled={isLoading}
  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black py-4.5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl shadow-blue-500/25 active:scale-[0.98] group mt-4"
>
  {isLoading ? 'INGRESANDO...' : 'INGRESAR AL PANEL'}
  <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
</button>
```

---

## Step 3: Update App.tsx

**File**: `App.tsx`

Replace the initial `useEffect` (lines 48-80):

```typescript
// OLD CODE:
useEffect(() => {
  const loadData = async () => {
    try {
      const session = localStorage.getItem('sim_auth');
      if (session === 'true') setIsAuthenticated(true);
      
      const savedTheme = localStorage.getItem('sim_theme');
      if (savedTheme === 'dark') {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      }

      const [items, trans, projs, cats] = await Promise.all([
        inventoryService.getAll(),
        transactionService.getAll(),
        projectService.getAll(),
        categoryService.getAll()
      ]);
      
      setInventory(items);
      setTransactions(trans);
      setProjects(projs);
      setCategories(cats);
    } catch (error) {
      console.error('Error loading data from Supabase:', error);
      
      const savedCats = localStorage.getItem('sim_categories');
      if (savedCats) setCategories(JSON.parse(savedCats));

      const savedInventory = localStorage.getItem('sim_inventory');
      if (savedInventory) {
        setInventory(JSON.parse(savedInventory));
      } else {
        setInventory(INITIAL_INVENTORY);
        localStorage.setItem('sim_inventory', JSON.stringify(INITIAL_INVENTORY));
      }

      const savedTransactions = localStorage.getItem('sim_transactions');
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
      
      const savedProjects = localStorage.getItem('sim_projects');
      if (savedProjects) setProjects(JSON.parse(savedProjects));
    }
  };
  
  loadData();
}, []);

// NEW CODE:
useEffect(() => {
  const initializeApp = async () => {
    try {
      const { authService } = await import('./services/auth');
      
      // Check existing session
      const session = await authService.getSession();
      if (session) setIsAuthenticated(true);
      
      // Listen for auth changes
      const { data: { subscription } } = authService.onAuthStateChange((isAuth) => {
        setIsAuthenticated(isAuth);
      });

      // Load theme
      const savedTheme = localStorage.getItem('sim_theme');
      if (savedTheme === 'dark') {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      }

      // Load data
      const [items, trans, projs, cats] = await Promise.all([
        inventoryService.getAll(),
        transactionService.getAll(),
        projectService.getAll(),
        categoryService.getAll()
      ]);
      
      setInventory(items);
      setTransactions(trans);
      setProjects(projs);
      setCategories(cats);

      return () => subscription?.unsubscribe();
    } catch (error) {
      console.error('Error initializing app:', error);
      
      const savedCats = localStorage.getItem('sim_categories');
      if (savedCats) setCategories(JSON.parse(savedCats));

      const savedInventory = localStorage.getItem('sim_inventory');
      if (savedInventory) {
        setInventory(JSON.parse(savedInventory));
      } else {
        setInventory(INITIAL_INVENTORY);
        localStorage.setItem('sim_inventory', JSON.stringify(INITIAL_INVENTORY));
      }

      const savedTransactions = localStorage.getItem('sim_transactions');
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
      
      const savedProjects = localStorage.getItem('sim_projects');
      if (savedProjects) setProjects(JSON.parse(savedProjects));
    }
  };
  
  initializeApp();
}, []);
```

Update `handleLogin` and `handleLogout`:

```typescript
// OLD CODE:
const handleLogin = () => {
  setIsAuthenticated(true);
  localStorage.setItem('sim_auth', 'true');
};

const handleLogout = () => {
  setIsAuthenticated(false);
  localStorage.removeItem('sim_auth');
  setCurrentTab('dashboard');
};

// NEW CODE:
const handleLogin = () => {
  setIsAuthenticated(true);
};

const handleLogout = async () => {
  try {
    const { authService } = await import('./services/auth');
    await authService.signOut();
    setIsAuthenticated(false);
    setCurrentTab('dashboard');
  } catch (error) {
    console.error('Logout error:', error);
  }
};
```

---

## Step 4: Create Test Users in Supabase

In Supabase Dashboard → Authentication → Users:

1. Click "Add user"
2. Create test user:
   - **Email**: `admin@jfsolar.com`
   - **Password**: `Admin123!`
   - Confirm password

3. Create another user:
   - **Email**: `user@jfsolar.com`
   - **Password**: `User123!`

---

## Step 5: Update .env

**File**: `.env`

```env
VITE_SUPABASE_URL=https://joqvtehquymknvizcblu.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## Step 6: Enable RLS on Users Table (Optional Security)

In Supabase Dashboard → SQL Editor, run:

```sql
-- Allow users to read their own data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

---

## Testing Checklist

- [ ] Login with `admin@jfsolar.com` / `Admin123!`
- [ ] Verify session persists on page refresh
- [ ] Logout and verify redirect to login
- [ ] Try invalid credentials → error message
- [ ] Dark mode toggle works
- [ ] Data loads from Supabase after login
- [ ] All handlers still work (add/edit/delete)

---

## Migration Path

### Option A: Keep Both (Recommended for Testing)
- Supabase auth for new logins
- LocalStorage fallback for existing users
- Gradual migration

### Option B: Full Switch
- Delete hardcoded credentials
- Require all users to use Supabase auth
- Immediate cutover

---

## Troubleshooting

### "Invalid login credentials"
- Verify user exists in Supabase → Authentication → Users
- Check email/password are correct
- Ensure user is confirmed (check email column)

### Session not persisting
- Check browser localStorage is enabled
- Verify Supabase session cookie settings
- Check browser console for errors

### CORS errors
- Verify VITE_SUPABASE_URL is correct
- Check Supabase project settings → API

---

## Files Modified

1. ✅ `services/auth.ts` (NEW)
2. ✅ `components/Login.tsx` (UPDATED)
3. ✅ `App.tsx` (UPDATED)
4. ✅ `.env` (UPDATED)

---

## Next Steps

After implementation:
1. Test with created users
2. Remove hardcoded credentials from codebase
3. Set up email verification (optional)
4. Add password reset functionality (optional)
5. Implement role-based access control (optional)

---

**Status**: Ready for implementation  
**Complexity**: Low  
**Time Estimate**: 15-20 minutes
