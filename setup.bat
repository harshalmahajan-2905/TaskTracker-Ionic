@echo off
echo 🚀 Setting up TaskManagerApp...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher.
    pause
    exit /b 1
)

:: Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

:: Install dependencies
echo 📦 Installing dependencies...
npm install

:: Check if Ionic CLI is installed globally
ionic --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔧 Installing Ionic CLI globally...
    npm install -g @ionic/cli
)

:: Check if Capacitor CLI is installed globally
cap --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔧 Installing Capacitor CLI globally...
    npm install -g @capacitor/cli
)

echo ✅ Setup complete!
echo.
echo 🎯 Available commands:
echo   npm start          - Start development server
echo   ionic serve        - Start Ionic development server
echo   ionic build        - Build for production
echo   ionic capacitor add ios     - Add iOS platform
echo   ionic capacitor add android - Add Android platform
echo   ionic capacitor run ios     - Run on iOS
echo   ionic capacitor run android - Run on Android
echo.
echo 🚀 To start the app: npm start
pause
