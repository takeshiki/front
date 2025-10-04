# 🐛 Debug Guide - "Registration failed"

## Step 1: Open Browser Console

1. Press **F12** (or right-click → Inspect)
2. Go to **Console** tab
3. Clear console (🚫 button)

## Step 2: Try to Register Again

Fill the registration form and click "Create Account"

## Step 3: Check Console Logs

You will see detailed information:

### ✅ Successful Registration
```
Sending registration request: {name: "...", industry: "...", ...}
Response status: 201
Registration successful: {id: "...", name: "...", ...}
```

### ❌ Connection Error
```
Registration error: TypeError: Failed to fetch
```
**Problem:** Backend not running or wrong URL

**Solution:**
1. Check backend: http://localhost:8000/api/health
2. Check `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8000/api`
3. Restart `npm run dev`

### ❌ CORS Error
```
Access to fetch at 'http://localhost:8000/api/companies' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```
**Problem:** Backend doesn't allow requests from `localhost:3000`

**Solution:**
Check `back/src/main.ts`:
```typescript
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
})
```

### ❌ 400 Bad Request
```
Response status: 400
Registration failed: {message: "Validation failed", errors: [...]}
```
**Problem:** Invalid data

**Solution:**
Check `errors` in console - maybe password too short, email already exists, or required fields missing.

### ❌ 404 Not Found
```
Response status: 404
Registration failed: Not Found
```
**Problem:** Endpoint doesn't exist

**Solution:**
1. Check URL: should be `http://localhost:8000/api/companies`
2. Check `.env.local`
3. Check Swagger: http://localhost:8000/api/docs

### ❌ 500 Internal Server Error
```
Response status: 500
Registration failed: Internal server error
```
**Problem:** Backend error

**Solution:**
Check backend logs where `npm run start:dev` is running - MongoDB not connected? Code error?

## Quick Checklist

- [ ] Backend running on port 8000
- [ ] MongoDB running/connected
- [ ] File `.env.local` created
- [ ] `NEXT_PUBLIC_API_URL=http://localhost:8000/api` in `.env.local`
- [ ] Next.js restarted after creating `.env.local`
- [ ] http://localhost:8000/api/health returns `{"status":"healthy"}`
- [ ] Browser console (F12) open
- [ ] All form fields filled

## Manual Testing

Open browser console (F12) and run:

```javascript
// Test connection
fetch('http://localhost:8000/api/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend OK:', d))
  .catch(e => console.error('❌ Backend ERROR:', e))

// Test registration
fetch('http://localhost:8000/api/companies', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Test Company",
    industry: "technology",
    size: "1-10",
    contactName: "John Doe",
    email: `test${Date.now()}@test.com`,
    password: "password123"
  })
})
  .then(r => r.json())
  .then(d => console.log('✅ Registration OK:', d))
  .catch(e => console.error('❌ Registration ERROR:', e))
```

