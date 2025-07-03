#!/bin/bash

# 🧠 Solace AI Mobile - Quick Setup Script
# This script sets up the entire project with one command

echo "🧠 Welcome to Solace AI Mobile Setup!"
echo "======================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

echo ""
echo "📦 Installing main project dependencies..."
npm install

echo ""
echo "🎨 Installing theme preview dependencies..."
cd theme-preview
npm install
cd ..

echo ""
echo "🧪 Running accessibility tests..."
npm run test:accessibility

echo ""
echo "🎨 Running theme validation..."
npm run test:theme

echo ""
echo "🎯 Running integration tests..."
npm run test:integration

echo ""
echo "🚀 Setup complete! Here's what you can do now:"
echo ""
echo "📱 Start React Native development:"
echo "   npm start"
echo "   npm run android  # For Android"
echo "   npm run ios      # For iOS (macOS only)"
echo ""
echo "🌐 Start live theme preview:"
echo "   npm run theme-preview"
echo "   Then open: http://localhost:3000"
echo ""
echo "🧪 Run tests:"
echo "   npm run test:accessibility  # Accessibility analysis"
echo "   npm run test:theme         # Theme validation" 
echo "   npm run test:integration   # Full integration test"
echo "   npm run test:all           # All tests"
echo ""
echo "📚 Documentation:"
echo "   - README.md                    # Complete setup guide"
echo "   - THEME_IMPLEMENTATION_COMPLETE.md  # Implementation details"
echo "   - ACCESSIBILITY_NEXT_STEPS.md       # Accessibility roadmap"
echo ""
echo "🎉 Solace AI Mobile is ready for development!"
echo "Visit the live preview to see all accessibility features in action."
