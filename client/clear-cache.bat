@echo off
echo Clearing React Native / Expo cache...

echo Stopping Metro bundler...
taskkill /F /IM node.exe /T 2>nul

echo Clearing Metro bundler cache...
if exist .expo rmdir /s /q .expo
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo Clearing Android cache...
if exist android (
    cd android
    call gradlew clean 2>nul
    cd ..
    if exist android\.gradle rmdir /s /q android\.gradle
    if exist android\app\build rmdir /s /q android\app\build
)

echo Cache cleared successfully!
echo.
echo To start the app again, run:
echo   npm start -- --clear
