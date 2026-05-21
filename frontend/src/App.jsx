import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages (to be implemented)
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
          <Route path="/" element={<div style={{ padding: '20px' }}>
            <h1>Welcome to Residential Management System</h1>
            <p>Frontend scaffolding is ready. Start implementing pages and components.</p>
          </div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
