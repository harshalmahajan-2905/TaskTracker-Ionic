# Development Guide

## Quick Start

1. **Setup the project:**
   ```bash
   # On Windows
   setup.bat
   
   # On macOS/Linux
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Start development server:**
   ```bash
   npm start
   # or
   ionic serve
   ```

3. **Access the app:**
   - Open browser to `http://localhost:8100`
   - Create a new account or use test credentials

## Development Workflow

### 1. Authentication Flow
- Navigate to `/login` 
- Create account via `/signup`
- Test authentication with Ionic Storage

### 2. Task Management
- Create tasks with titles, descriptions, due dates
- Upload images using camera or gallery
- Test offline functionality by disabling network

### 3. API Integration
- Sample tasks loaded from JSONPlaceholder API
- Local tasks merged with API data
- Offline sync when connection restored

## Testing Features

### Authentication
```bash
# Test user data:
Email: test@example.com
Password: password123
Name: Test User
```

### Camera Integration
- Test camera permissions
- Capture photos on device
- Select images from gallery
- Image storage and display

### Offline Mode
1. Create tasks while online
2. Disconnect from internet
3. Create more tasks (stored locally)
4. Reconnect - observe sync behavior

### Task Operations
- Create: Add new tasks with all fields
- Read: View task list and details
- Update: Edit existing tasks
- Delete: Remove tasks with confirmation

## Mobile Development

### iOS Setup
```bash
npm run cap:add:ios
npm run cap:build:ios
npm run cap:run:ios
```

### Android Setup
```bash
npm run cap:add:android
npm run cap:build:android
npm run cap:run:android
```

### Required Permissions

**iOS (Info.plist):**
```xml
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to take photos for tasks</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs photo library access to select images for tasks</string>
```

**Android (AndroidManifest.xml):**
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## Code Structure

### Services
- `AuthService`: User authentication and session management
- `TaskService`: CRUD operations, API integration, offline sync
- `CameraService`: Photo capture and gallery selection

### Guards
- `AuthGuard`: Route protection for authenticated users

### Pages
- `LoginPage`: User authentication
- `SignupPage`: User registration  
- `TaskListPage`: Task overview with filtering
- `TaskDetailPage`: Individual task view
- `AddTaskPage`: Create new tasks
- `EditTaskPage`: Modify existing tasks

### Models
- `Task`: Core task interface
- `TaskStatus`: Enum for task states
- `User`: User account interface
- `AuthResponse`: Authentication response

## API Endpoints

### JSONPlaceholder Integration
- **URL**: `https://jsonplaceholder.typicode.com/todos`
- **Method**: GET
- **Limit**: 10 tasks
- **Mapping**: Converts API format to local Task model

## Storage

### Ionic Storage Keys
- `users`: Array of registered users
- `currentUser`: Currently logged-in user
- `tasks`: Array of all tasks (local + API)

## Styling

### CSS Variables
- Primary: `--ion-color-primary`
- Success: `--ion-color-success` 
- Warning: `--ion-color-warning`
- Danger: `--ion-color-danger`

### Custom Classes
- `.task-card`: Task list item styling
- `.task-status-chip`: Status indicator
- `.offline-indicator`: Offline mode banner
- `.loading-container`: Loading state layout

## Debugging

### Browser DevTools
1. Open Network tab to monitor API calls
2. Check Application > Local Storage for Ionic Storage data
3. Use Console for service method debugging

### Mobile Debugging
1. Enable Developer Options on Android
2. Use Safari Web Inspector for iOS
3. Chrome DevTools for Android debugging

## Performance Tips

1. **Lazy Loading**: All pages use lazy loading modules
2. **Image Optimization**: Compress images before storage
3. **Caching**: API responses cached locally
4. **Offline First**: App functions without network

## Common Issues

### Camera Not Working
- Check device permissions
- Verify Capacitor plugins installed
- Test on physical device (camera doesn't work in browser)

### Storage Issues
- Clear browser storage if data corrupted
- Check Ionic Storage initialization
- Verify async/await patterns

### API Errors
- Check network connectivity
- Verify CORS settings for web
- Handle HTTP error responses

### Build Errors
- Clear node_modules and reinstall
- Check TypeScript version compatibility
- Verify all imports are correct

## Production Deployment

### Web Build
```bash
npm run build
# Files output to dist/app/
```

### Mobile Build
```bash
# iOS
npm run cap:build:ios
open ios/App/App.xcworkspace

# Android  
npm run cap:build:android
# Open in Android Studio: android/
```

### Environment Variables
- Development: `src/environments/environment.ts`
- Production: `src/environments/environment.prod.ts`
