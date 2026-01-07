# Windows Fix Guide - Complete Solution

## The Real Problems

1. ❌ **Metro Cache Corruption** - `InternalBytecode.js` error
2. ❌ **Server Not Running** - Network Error because backend isn't started
3. ❌ **Cache on Wrong Machine** - I cleared cache in Docker, but you're on Windows

## Quick Fix (3 Steps)

### Step 1: Start the Backend Server

Open **Terminal 1** (PowerShell or CMD):

```batch
cd C:\Code\Work\Calo\Calo
START_SERVER.bat
```

Wait until you see:
```
🚀 Server running on port 5000
```

**Keep this terminal open!**

### Step 2: Clear Metro Cache

Open **Terminal 2**:

```batch
cd C:\Code\Work\Calo\Calo
FIX_WINDOWS.bat
```

This will:
- Verify server is running
- Clear all Metro cache files
- Clear Watchman cache
- Prepare the client

### Step 3: Start the Client

In the same **Terminal 2** (after FIX_WINDOWS.bat completes):

```batch
cd client
npm start -- --clear
```

Or simply run:
```batch
START_CLIENT.bat
```

## Manual Fix (If Scripts Don't Work)

### Terminal 1 - Start Server

```batch
cd server
npm install
npx prisma generate
npm run dev
```

### Terminal 2 - Clear Cache & Start Client

```batch
cd client

REM Clear cache
rmdir /s /q .expo
rmdir /s /q node_modules\.cache
del /q %TEMP%\metro-*
del /q %TEMP%\haste-map-*

REM Start with clear cache
npm start -- --clear
```

## Verify Server is Running

Open your browser and go to:
```
http://192.168.1.74:5000/health
```

You should see:
```json
{
  "status": "ok",
  "database": "connected"
}
```

## Common Issues

### Issue 1: "Server not running"
**Solution:** Make sure Terminal 1 is still open with the server running

### Issue 2: "Cannot connect to database"
**Solution:** Update `server/.env` with correct database credentials
- See `SETUP_INSTRUCTIONS.md`
- Or use SQLite: Follow `QUICK_START.md`

### Issue 3: Metro cache won't clear
**Solution:**
1. Close Expo Dev Tools completely
2. Close Visual Studio Code
3. Run `clear-metro-cache.bat`
4. Restart everything

### Issue 4: "Port 5000 already in use"
**Solution:**
```batch
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue 5: Watchman errors
**Solution:** Install Watchman (optional but recommended)
```batch
choco install watchman
```

## File Structure

```
C:\Code\Work\Calo\Calo\
├── server/
│   ├── .env              ← Your database config
│   └── src/
├── client/
│   ├── .env              ← Has EXPO_PUBLIC_API_URL
│   └── app/
├── START_SERVER.bat      ← Run this FIRST
├── START_CLIENT.bat      ← Run this SECOND
├── FIX_WINDOWS.bat       ← Fix Metro cache issues
└── clear-metro-cache.bat ← Emergency cache clear
```

## Environment Variables

### client/.env (Already Correct ✓)
```env
EXPO_PUBLIC_API_URL=http://192.168.1.74:5000/api
```

### server/.env (YOU NEED TO CREATE THIS!)

**Option A - Supabase (Production):**
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.0ec90b57d6e95fcbda19832f.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.0ec90b57d6e95fcbda19832f.supabase.co:5432/postgres"
OPENAI_API_KEY=
API_BASE_URL=http://192.168.1.74:5000/api
CLIENT_URL=http://localhost:8081
```

**Option B - SQLite (Quick Test):**
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
DIRECT_URL="file:./dev.db"
OPENAI_API_KEY=
API_BASE_URL=http://192.168.1.74:5000/api
CLIENT_URL=http://localhost:8081
```

For SQLite, also change `server/prisma/schema.prisma`:
```prisma
datasource db {
  provider = "sqlite"  // Change from "postgresql"
  url      = env("DATABASE_URL")
}
```

## Expected Results

After following these steps:

✅ Metro cache cleared
✅ Server running at http://192.168.1.74:5000
✅ Client connects successfully
✅ No more "InternalBytecode.js" errors
✅ No more "Network Error" messages
✅ Calendar loads data successfully

## Still Having Issues?

1. Check both terminals are running
2. Verify server/.env file exists
3. Check firewall isn't blocking port 5000
4. Try using 127.0.0.1 instead of 192.168.1.74 in .env files
5. Restart your computer (clears all cache)

## Test Connection

In PowerShell:
```powershell
# Test server
curl http://192.168.1.74:5000/health

# Test API
curl http://192.168.1.74:5000/api/test
```

Both should return JSON responses, not errors.
