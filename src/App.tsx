
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Dashboard from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import CoursesPage from "./pages/Courses";
import CourseDetailsPage from "./pages/CourseDetails";
import CourseContent from "./pages/CourseContent";
import MyLearningPage from "./pages/MyLearning";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import UserManagementPage from "./pages/UserManagement";
import ProfilePage from "./pages/Profile";
import EnrollPage from "./pages/Enroll";
import AssessmentPage from "./pages/Assessment";
import SettingsPage from "./pages/Settings";
import AdminDashboard from "./pages/admin/Dashboard";
import CourseManagement from "./pages/admin/CourseManagement";
import CourseForm from "./pages/admin/CourseForm";
import AssessmentManagement from "./pages/admin/AssessmentManagement";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="container py-8 text-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Role-based route component
const RoleRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="container py-8 text-center">Loading...</div>;
  }

  // Make case-insensitive comparison for roles
  if (!user || !allowedRoles.some(role => 
    user.role.toUpperCase() === role.toUpperCase()
  )) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Admin route component - For backward compatibility
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <RoleRoute allowedRoles={['admin']}>
      {children}
    </RoleRoute>
  );
};

// Instructor route component
const InstructorRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <RoleRoute allowedRoles={['instructor', 'admin']}>
      {children}
    </RoleRoute>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route 
                path="dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="courses" 
                element={
                  <ProtectedRoute>
                    <CoursesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="courses/:slug" 
                element={
                  <ProtectedRoute>
                    <CourseDetailsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="course-content/:slug" 
                element={
                  <ProtectedRoute>
                    <CourseContent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="my-learning" 
                element={
                  <ProtectedRoute>
                    <MyLearningPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="user-management" 
                element={
                  <AdminRoute>
                    <UserManagementPage />
                  </AdminRoute>
                } 
              />
              <Route 
                path="profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="settings" 
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="enroll/:slug" 
                element={
                  <ProtectedRoute>
                    <EnrollPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="assessment/:id" 
                element={
                  <ProtectedRoute>
                    <AssessmentPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              <Route 
                path="admin/courses" 
                element={
                  <AdminRoute>
                    <CourseManagement />
                  </AdminRoute>
                } 
              />
              <Route 
                path="admin/courses/new" 
                element={
                  <AdminRoute>
                    <CourseForm />
                  </AdminRoute>
                } 
              />
              <Route 
                path="admin/courses/edit/:id" 
                element={
                  <AdminRoute>
                    <CourseForm />
                  </AdminRoute>
                } 
              />
              <Route 
                path="admin/assessments" 
                element={
                  <AdminRoute>
                    <AssessmentManagement />
                  </AdminRoute>
                } 
              />
              
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
