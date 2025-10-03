# Task Manager App

A complete full-stack task management application with Ionic Angular frontend and Node.js/Express backend. Features user authentication, real-time task management, camera integration, and deployment-ready architecture.

## 🚀 Features

### Frontend (Ionic Angular)
- **User Authentication**: JWT-based signup & login with secure token storage
- **Task Management**: Complete CRUD operations with real-time updates
- **Camera Integration**: Photo capture and gallery selection using Capacitor
- **Offline Support**: Local storage fallback with automatic sync
- **Modern UI**: Clean Ionic design with responsive layout
- **Production Ready**: Optimized builds for web and mobile platforms

### Backend (Node.js/Express)
- **RESTful API**: Complete task management endpoints
- **JWT Authentication**: Secure user authentication and authorization
- **Data Persistence**: In-memory storage (easily upgradeable to MongoDB)
- **CORS Enabled**: Cross-origin resource sharing for frontend integration
- **Error Handling**: Comprehensive error responses and validation

## 🛠️ Tech Stack

### Frontend
- **Framework**: Ionic 7 + Angular 16
- **Language**: TypeScript
- **Storage**: Ionic Storage + Local Storage
- **Camera**: Capacitor Camera Plugin
- **HTTP**: Angular HttpClient
- **Styling**: Ionic Components + Custom CSS

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs for password hashing
- **CORS**: Cross-origin resource sharing
- **Environment**: dotenv for configuration

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Ionic CLI (`npm install -g @ionic/cli`)
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/harshalmahajan-2905/Expensetracker-Ionic.git
cd Expensetracker-Ionic
```

### 2. Setup Backend
```bash
cd backend
npm install
npm start
```
Backend will run on `http://localhost:3000`

### 3. Setup Frontend
```bash
cd .. # Go back to root directory
npm install
npx ng serve --host localhost --port 8100
```
Frontend will run on `http://localhost:8100`

## 📁 Project Structure

```
├── backend/                    # Node.js/Express Backend
│   ├── node_modules/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js              # Main server file
├── src/                       # Ionic Angular Frontend
│   ├── app/
│   │   ├── guards/
│   │   │   └── auth.guard.ts  # Route protection
│   │   ├── models/
│   │   │   └── task.model.ts  # TypeScript interfaces
│   │   ├── pages/
│   │   │   ├── add-task/      # Add new task
│   │   │   ├── edit-task/     # Edit existing task
│   │   │   ├── login/         # User login
│   │   │   ├── signup/        # User registration
│   │   │   ├── task-detail/   # Task details view
│   │   │   └── task-list/     # Tasks listing
│   │   ├── services/
│   │   │   ├── auth.service.ts    # Authentication service
│   │   │   ├── camera.service.ts  # Camera functionality
│   │   │   └── task.service.ts    # Task management
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   ├── environments/
│   │   ├── environment.ts         # Development config
│   │   └── environment.prod.ts    # Production config
│   ├── theme/
│   │   └── variables.scss         # Ionic theme variables
│   ├── global.scss
│   └── index.html
├── dist/                      # Production build output
├── netlify.toml              # Netlify deployment config
├── angular.json              # Angular configuration
├── capacitor.config.ts       # Capacitor configuration
├── ionic.config.json         # Ionic configuration
├── package.json              # Frontend dependencies
└── README.md                 # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Tasks (Protected Routes)
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Health Check
- `GET /api/health` - API health status
- `GET /` - API information

## 🗄️ Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}
```

### Task Model
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed'
}
```

### Auth Response
```typescript
interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}
```

## 🏗️ Building for Production

### Frontend Build
```bash
npx ng build --configuration production
```

### Backend Production
```bash
cd backend
npm start
```

## 🚀 Deployment

### Deploy Backend to Render
1. Go to [render.com](https://render.com)
2. Connect GitHub repository
3. Create Web Service with:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `JWT_SECRET`: `your-secret-key`
     - `NODE_ENV`: `production`

### Deploy Frontend to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Build settings:
   - **Build Command**: `npx ng build --configuration production`
   - **Publish Directory**: `dist/app`
4. Update `src/environments/environment.prod.ts` with your Render backend URL

## 📱 Mobile Development

### Add Platforms
```bash
ionic capacitor add ios
ionic capacitor add android
```

### Build and Sync
```bash
ionic build --prod
ionic capacitor sync
```

### Run on Device
```bash
ionic capacitor run ios
ionic capacitor run android
```

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Protected API routes with middleware
- CORS configuration for secure cross-origin requests
- Token storage in secure Ionic Storage

## 🧪 Testing

### Frontend Tests
```bash
ng test
ng lint
```

### Backend Testing
```bash
cd backend
npm test  # Add your test scripts
```

## 🌐 Environment Configuration

### Development
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### Production
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://your-backend.onrender.com/api'
};
```

## 📦 Dependencies

### Frontend Key Dependencies
- `@ionic/angular`: ^7.0.0
- `@angular/core`: ^16.0.0
- `@capacitor/camera`: ^5.0.0
- `@ionic/storage-angular`: ^4.0.0

### Backend Key Dependencies
- `express`: ^4.18.2
- `jsonwebtoken`: ^9.0.2
- `bcryptjs`: ^2.4.3
- `cors`: ^2.8.5
- `dotenv`: ^16.3.1

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👨‍💻 Author

**Harshal Mahajan** - [@harshalmahajan-2905](https://github.com/harshalmahajan-2905)

## 🌐 Live Links

- **Frontend (Netlify)**: https://tasktrackerionic.netlify.app/
- **Backend (Render)**: https://tasktracker-ionic-w6rz.onrender.com

## 🆘 Troubleshooting

### Common Issues

1. **Ionic CLI not found**: Install globally with `npm install -g @ionic/cli`
2. **Build errors**: Clear node_modules and reinstall dependencies
3. **CORS issues**: Ensure backend CORS is configured for your frontend domain
4. **Token errors**: Check JWT secret configuration in backend environment

### Support

For issues and questions, please open an issue in the GitHub repository.
