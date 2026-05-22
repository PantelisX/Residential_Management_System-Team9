# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# Residential Management System - Frontend

A modern React + Vite frontend for the Residential Management System, providing a user interface for managing maintenance tasks and residence operations.

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable React components
│   │   ├── auth/          # Authentication components
│   │   ├── layout/        # Layout components (Header, Sidebar, Footer)
│   │   └── common/        # Common/shared components
│   ├── pages/             # Page-level components
│   ├── services/          # API service layer
│   │   ├── api.js         # Axios instance with interceptors
│   │   ├── authService.js # Authentication API calls
│   │   └── maintenanceService.js # Maintenance task API calls
│   ├── context/           # React Context for state management
│   │   └── AuthContext.jsx # Authentication context
│   ├── hooks/             # Custom React hooks
│   │   └── useAuth.js     # Hook to access auth context
│   ├── utils/             # Utility functions
│   │   ├── tokenStorage.js # JWT token management
│   │   └── validators.js   # Form validation helpers
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## Installation

### Prerequisites
- Node.js 16+ and npm

### Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create environment configuration:
```bash
cp .env.example .env.local
```

3. Update `.env.local` with your backend API URL (default: `http://localhost:5000`)

## Development

Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000` by default.

### Vite Dev Server Features
- Hot module replacement (HMR) for instant code updates
- Automatic proxy to backend API (`/api/*` → `http://localhost:5000`)
- Fast refresh for React components

## Building

Create a production-ready build:
```bash
npm run build
```

Output files will be in the `dist/` directory.

Preview production build locally:
```bash
npm run preview
```

## Key Features Implemented

### 1. Service Layer (`src/services/`)
- **api.js**: Centralized Axios instance with:
  - Base URL configuration from environment variables
  - JWT token injection in request headers
  - Automatic 401 error handling
- **authService.js**: User registration and login
- **maintenanceService.js**: CRUD operations for maintenance tasks

### 2. Authentication (`src/context/`)
- **AuthContext.jsx**: Global auth state management
  - User information
  - Authentication token
  - Loading state
  - Login/logout methods

### 3. Custom Hooks (`src/hooks/`)
- **useAuth()**: Easy access to authentication context

### 4. Utilities (`src/utils/`)
- **tokenStorage.js**: JWT token management (get, set, remove, check)
- **validators.js**: Form validation helpers
  - Email validation
  - Password strength validation
  - Username validation
  - Required field validation

### 5. Styling
- Global CSS in `src/index.css`
- Ready for Tailwind CSS or other CSS framework integration
- Responsive design foundation

## Backend Integration

The frontend is pre-configured to communicate with the backend API:

### API Configuration
- Base URL: `http://localhost:5000` (configurable via `VITE_API_URL`)
- Authentication: JWT Bearer tokens in `Authorization` header
- Content-Type: `application/json`

### Available Endpoints (Backend)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/maintenance/tasks` - Get all maintenance tasks
- `GET /api/maintenance/tasks/:id` - Get specific task
- `POST /api/maintenance/tasks` - Create new task
- `PUT /api/maintenance/tasks/:id` - Update task
- `DELETE /api/maintenance/tasks/:id` - Delete task

## Next Steps

1. **Implement Pages**: Create actual page components in `src/pages/`
   - LoginPage
   - RegisterPage
   - DashboardPage
   - MaintenanceTasksPage

2. **Implement Components**: Build reusable components in `src/components/`
   - LoginForm, RegisterForm (in `auth/`)
   - Header, Sidebar, Footer (in `layout/`)
   - Button, Input, Card (in `common/`)

3. **Add Styling**: Choose and integrate a CSS framework
   - Recommended: Tailwind CSS for utility-first styling
   - Alternative: Material-UI, Bootstrap, or custom CSS

4. **Complete Authentication Flow**: 
   - Implement ProtectedRoute component
   - Add login/register pages
   - Handle token refresh

5. **Implement Maintenance Features**:
   - Task list view
   - Task detail view
   - Task creation/editing forms
   - Task status management

## Environment Variables

Create a `.env.local` file:
```env
VITE_API_URL=http://localhost:5000
VITE_ENV=development
```

## Technologies Used

- **React 18** - UI library
- **React Router DOM v6** - Client-side routing
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client with interceptors
- **Context API** - State management

## Development Tips

1. **API Debugging**: Check browser DevTools Network tab to see API requests
2. **Token Issues**: Clear localStorage and re-login if experiencing auth issues
3. **Environment Setup**: Ensure backend is running on port 5000 before starting frontend
4. **HMR**: Changes to `.jsx` files will hot-reload automatically

## Troubleshooting

### Backend connection issues
- Verify backend is running on `http://localhost:5000`
- Check `VITE_API_URL` environment variable
- Look for CORS errors in browser console

### Authentication errors
- Check if JWT token is saved in localStorage
- Verify backend is sending token in login response
- Check token expiration

### Build errors
- Clear `node_modules/` and run `npm install` again
- Delete `dist/` folder and rebuild

## Contributing

1. Follow React best practices
2. Keep components focused and reusable
3. Use TypeScript or JSDoc for documentation
4. Test API integration with backend

## License

See main project LICENSE file.
