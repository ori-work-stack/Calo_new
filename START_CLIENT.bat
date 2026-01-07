@echo off
echo ========================================
echo    STARTING CLIENT (EXPO)
echo ========================================
echo.

REM Check if server is running
curl -s http://192.168.1.74:5000/health >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Server is NOT running at http://192.168.1.74:5000
    echo.
    echo Please start the server first by running START_SERVER.bat
    echo.
    choice /C YN /M "Do you want to continue anyway"
    if errorlevel 2 exit /b 1
)

cd client

REM Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting Expo...
echo.

call npm start -- --clear
