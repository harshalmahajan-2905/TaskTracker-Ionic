#!/bin/bash

echo "🚀 Setting up TaskManagerApp..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if Ionic CLI is installed globally
if ! command -v ionic &> /dev/null; then
    echo "🔧 Installing Ionic CLI globally..."
    npm install -g @ionic/cli
fi

# Check if Capacitor CLI is installed globally
if ! command -v cap &> /dev/null; then
    echo "🔧 Installing Capacitor CLI globally..."
    npm install -g @capacitor/cli
fi

echo "✅ Setup complete!"
echo ""
echo "🎯 Available commands:"
echo "  npm start          - Start development server"
echo "  ionic serve        - Start Ionic development server"
echo "  ionic build        - Build for production"
echo "  ionic capacitor add ios     - Add iOS platform"
echo "  ionic capacitor add android - Add Android platform"
echo "  ionic capacitor run ios     - Run on iOS"
echo "  ionic capacitor run android - Run on Android"
echo ""
echo "🚀 To start the app: npm start"
