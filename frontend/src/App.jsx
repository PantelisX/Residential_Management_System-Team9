function App() {
  return <AssignmentPage />;
}

export default App;
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import ResidencesPage from './pages/home/ResidencesPage';
import TasksPage from './pages/home/TasksPage';
import HistoryPage from './pages/home/HistoryPage';
import AssignmentsPage from './pages/home/AssignmentsPage';
import ProfilePage from './pages/home/ProfilePage';

// Pages (to be implemented)
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth Routes (to be implemented) */}
          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> */}

          {/* Protected Home Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          >
            <Route path="residences" element={<ResidencesPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            {/* Default redirect: /home -> /home/residences */}
            <Route index element={<Navigate to="/home/residences" replace />} />
          </Route>

          {/* Default redirect to home */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
