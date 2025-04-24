// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SignUpForm from './components/Signup';
import SignInForm from './components/Signin';
import AppPage from './components/App';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/signin" element={<SignInForm />} />
          <Route 
            path="/app" 
            element={
              <ProtectedRoute>
                <AppPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/signin" replace />} />
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;