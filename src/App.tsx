import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ConfirmEmail from './pages/auth/ConfirmEmail';
import AdminDashboard from './pages/admin/Dashboard';
import EmployerLicenses from './pages/employer/Licenses';
import Licenses from './pages/Licenses';
import UsersSimple from './pages/UsersSimple';
import Compliance from './pages/Compliance';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UpdateRole from './components/UpdateRole';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/Dasboard" element={<AdminDashboard />} />
              <Route path="/dashboard" element={<AdminDashboard />} />

              {/* Add routes for licenses, users, and compliance */}
              <Route path="/licenses" element={<Licenses />} />
              <Route path="/users" element={<UsersSimple />} />
              <Route path="/compliance" element={<Compliance />} />

              {/* Keep other routes for reference */}
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/confirm-email" element={<ConfirmEmail />} />
              <Route path="/update-role" element={<UpdateRole />} />
              <Route path="/employer/*" element={<EmployerLicenses />} />

              {/* Catch all route - redirect to dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
