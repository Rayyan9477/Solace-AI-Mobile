@echo off
REM 🧠 Solace AI Mobile - Quick Setup Script for Windows
REM This script sets up the entire project with one command

echo 🧠 Welcome to Solace AI Mobile Setup!
echo ======================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo ✅ npm found: 
npm --version

echo.
echo 📦 Installing main project dependencies...
npm install

echo.
echo 🎨 Installing theme preview dependencies...
cd theme-preview
npm install
cd ..

echo.
echo 🧪 Running accessibility tests...
npm run test:accessibility

echo.
echo 🎨 Running theme validation...
npm run test:theme

echo.
echo 🎯 Running integration tests...
npm run test:integration

echo.
echo 🚀 Setup complete! Here's what you can do now:
echo.
echo 📱 Start React Native development:
echo    npm start
echo    npm run android  # For Android
echo    npm run ios      # For iOS (macOS only)
echo.
echo 🌐 Start live theme preview:
echo    npm run theme-preview
echo    Then open: http://localhost:3000
echo.
echo 🧪 Run tests:
echo    npm run test:accessibility  # Accessibility analysis
echo    npm run test:theme         # Theme validation
echo    npm run test:integration   # Full integration test
echo    npm run test:all           # All tests
echo.
echo 📚 Documentation:
echo    - README.md                    # Complete setup guide
echo    - THEME_IMPLEMENTATION_COMPLETE.md  # Implementation details
echo    - ACCESSIBILITY_NEXT_STEPS.md       # Accessibility roadmap
echo.
echo 🎉 Solace AI Mobile is ready for development!
echo Visit the live preview to see all accessibility features in action.
echo.
pause
