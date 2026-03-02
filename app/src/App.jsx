import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import Login from './pages/Login';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import TodoList from './pages/TodoList';
import Calendar from './pages/Calendar';
import SchoolInfo from './pages/SchoolInfo';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
      <Route path="/dashboard/:childId" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/:childId/todos" element={<ProtectedRoute><TodoList /></ProtectedRoute>} />
      <Route path="/dashboard/:childId/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
      <Route path="/dashboard/:childId/school" element={<ProtectedRoute><SchoolInfo /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
