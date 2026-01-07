@echo off
setlocal enabledelayedexpansion
echo ========================================
echo    CHECKING YOUR SETUP
echo ========================================
echo.

set "ERRORS=0"
set "WARNINGS=0"

REM Check 1: Client .env file
echo [1/7] Checking client/.env...
if exist "client\.env" (
    findstr /C:"EXPO_PUBLIC_API_URL" "client\.env" >nul
    if !errorlevel! equ 0 (
        echo   ✓ client/.env exists and has API URL
    ) else (
        echo   ✗ client/.env missing EXPO_PUBLIC_API_URL
        set /a ERRORS+=1
    )
) else (
    echo   ✗ client/.env file NOT FOUND
    set /a ERRORS+=1
)
echo.

REM Check 2: Server .env file
echo [2/7] Checking server/.env...
if exist "server\.env" (
    findstr /C:"DATABASE_URL" "server\.env" >nul
    if !errorlevel! equ 0 (
        echo   ✓ server/.env exists and has DATABASE_URL
    ) else (
        echo   ✗ server/.env missing DATABASE_URL
        set /a ERRORS+=1
    )
) else (
    echo   ✗ server/.env file NOT FOUND
    echo   → Run: copy server\.env.local server\.env
    set /a ERRORS+=1
)
echo.

REM Check 3: Node modules
echo [3/7] Checking dependencies...
if exist "server\node_modules" (
    echo   ✓ Server dependencies installed
) else (
    echo   ⚠ Server dependencies not installed
    echo   → Run: cd server ^&^& npm install
    set /a WARNINGS+=1
)

if exist "client\node_modules" (
    echo   ✓ Client dependencies installed
) else (
    echo   ⚠ Client dependencies not installed
    echo   → Run: cd client ^&^& npm install
    set /a WARNINGS+=1
)
echo.

REM Check 4: Server running
echo [4/7] Checking if server is running...
curl -s http://192.168.1.74:5000/health >nul 2>&1
if !errorlevel! equ 0 (
    echo   ✓ Server is running at http://192.168.1.74:5000
) else (
    echo   ✗ Server is NOT running
    echo   → Run: START_SERVER.bat in a separate terminal
    set /a ERRORS+=1
)
echo.

REM Check 5: Metro cache
echo [5/7] Checking Metro cache...
if exist "client\.expo" (
    echo   ⚠ Metro cache exists (may need clearing)
    echo   → Run: FIX_WINDOWS.bat if you have errors
    set /a WARNINGS+=1
) else (
    echo   ✓ No Metro cache (clean state)
)
echo.

REM Check 6: Prisma
echo [6/7] Checking Prisma client...
if exist "server\node_modules\.prisma\client" (
    echo   ✓ Prisma client generated
) else (
    echo   ⚠ Prisma client not generated
    echo   → Run: cd server ^&^& npx prisma generate
    set /a WARNINGS+=1
)
echo.

REM Check 7: Ports availability (if server not running)
echo [7/7] Checking ports...
netstat -ano | findstr ":5000" >nul 2>&1
if !errorlevel! equ 0 (
    echo   ✓ Port 5000 in use (server should be running)
) else (
    echo   ⚠ Port 5000 is free (server not started)
)
echo.

REM Summary
echo ========================================
echo    SUMMARY
echo ========================================
echo.
if !ERRORS! equ 0 (
    if !WARNINGS! equ 0 (
        echo ✓ Everything looks good!
        echo.
        echo You can start the app:
        echo   1. START_SERVER.bat ^(if not running^)
        echo   2. START_CLIENT.bat
    ) else (
        echo ⚠ Setup is OK but has !WARNINGS! warning(s)
        echo.
        echo You can proceed, but consider fixing warnings.
    )
) else (
    echo ✗ Found !ERRORS! error(s) and !WARNINGS! warning(s)
    echo.
    echo Please fix the errors above before starting the app.
    echo.
    if !ERRORS! gtr 0 (
        echo Common fixes:
        echo   • Missing .env files: See SETUP_INSTRUCTIONS.md
        echo   • Server not running: Run START_SERVER.bat
        echo   • Dependencies: Run npm install in server and client
    )
)
echo.
pause
