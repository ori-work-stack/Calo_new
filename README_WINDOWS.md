# 🚀 Quick Start for Windows

## ⚠️ THE REAL PROBLEMS

You're getting these errors:

1. **`InternalBytecode.js` not found** → Metro cache corruption on YOUR Windows machine
2. **`Network Error`** → Backend server is NOT running at http://192.168.1.74:5000
3. Your `.env` file is correct! The problem is the cache and missing server.

## 🔧 INSTANT FIX (3 Commands)

### Step 1️⃣: Check Your Setup
```batch
CHECK_SETUP.bat
```

This will tell you exactly what's wrong.

### Step 2️⃣: Start Backend (Terminal 1)
```batch
START_SERVER.bat
```

**Leave this terminal OPEN!** Server must keep running.

### Step 3️⃣: Start Frontend (Terminal 2)
```batch
FIX_WINDOWS.bat
```

This clears cache and starts the client.

## ✅ What Should Happen

**Terminal 1 (Server):**
```
🚀 Server running on port 5000
✅ Database connected
ℹ️ Access: http://192.168.1.74:5000
```

**Terminal 2 (Client):**
```
Metro cache cleared! ✓
Starting Metro Bundler...
```

**Your Phone/Emulator:**
- No more "InternalBytecode.js" errors
- No more "Network Error" messages
- Calendar loads successfully

## 🆘 If It STILL Doesn't Work

### Problem: "Server won't start"

**Create `server/.env` file with this content:**

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
DIRECT_URL="file:./dev.db"
OPENAI_API_KEY=
API_BASE_URL=http://192.168.1.74:5000/api
CLIENT_URL=http://localhost:8081
```

**Then change `server/prisma/schema.prisma` line 7:**
```prisma
provider = "sqlite"  // Change from "postgresql"
```

**Then run:**
```batch
cd server
npx prisma db push
npx prisma generate
npm run dev
```

### Problem: "Metro cache won't clear"

```batch
cd client
rmdir /s /q .expo
rmdir /s /q node_modules\.cache
del /q %TEMP%\metro-*
del /q %TEMP%\haste-map-*
npm start -- --clear
```

### Problem: "Port 5000 already in use"

```batch
netstat -ano | findstr :5000
REM Find the PID (last column)
taskkill /PID <PID> /F
```

### Problem: "Cannot connect to database"

You have 2 options:

**Option A: Use SQLite (EASIEST)**
1. Follow the steps in "Server won't start" above
2. This works offline, no Supabase needed

**Option B: Use Supabase**
1. Go to https://supabase.com/dashboard/project/0ec90b57d6e95fcbda19832f
2. Settings → Database → Connection String
3. Copy the URI and paste in `server/.env` as DATABASE_URL

## 📁 Where Are Your Files?

```
C:\Code\Work\Calo\Calo\
│
├── 📄 CHECK_SETUP.bat       ← RUN THIS FIRST!
├── 📄 START_SERVER.bat      ← Start backend
├── 📄 START_CLIENT.bat      ← Start frontend
├── 📄 FIX_WINDOWS.bat        ← Clear cache + start
│
├── server/
│   ├── .env                 ← CREATE THIS FILE!
│   └── .env.local           ← Copy this to .env
│
└── client/
    └── .env                 ← ✓ Already correct
```

## 🎯 The Order Matters!

1. `CHECK_SETUP.bat` - See what's wrong
2. `START_SERVER.bat` - Start backend (keep running)
3. `FIX_WINDOWS.bat` - Clear cache + start frontend

OR manually:

1. `START_SERVER.bat` in Terminal 1
2. `cd client && npm start -- --clear` in Terminal 2

## 💡 Pro Tips

- **Always** start server BEFORE client
- **Keep** server terminal open
- **Clear cache** if you see weird errors
- **Check** http://192.168.1.74:5000/health in browser to verify server

## 🔍 Verify It's Working

Open browser and test:
```
http://192.168.1.74:5000/health
```

Should return:
```json
{"status":"ok","database":"connected"}
```

If this works, your app will work!

## 📚 More Help

- `WINDOWS_FIX_GUIDE.md` - Detailed troubleshooting
- `SETUP_INSTRUCTIONS.md` - Supabase database setup
- `QUICK_START.md` - SQLite alternative
- `ERRORS_FIXED.md` - What we fixed

---

**TL;DR:**
1. Run `CHECK_SETUP.bat`
2. Run `START_SERVER.bat` (keep open)
3. Run `FIX_WINDOWS.bat`
4. Done! 🎉
