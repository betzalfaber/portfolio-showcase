import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/navigation/ProtectedRoute';

// Public pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { SkillsPage } from './pages/SkillsPage';
import { EducationPage } from './pages/EducationPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminCertificatesPage } from './pages/admin/AdminCertificatesPage';
import { AdminSkillsPage } from './pages/admin/AdminSkillsPage';
import { AdminEducationPage } from './pages/admin/AdminEducationPage';
import { AdminAchievementsPage } from './pages/admin/AdminAchievementsPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin Console Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="projects" element={<AdminProjectsPage />} />
            <Route path="certificates" element={<AdminCertificatesPage />} />
            <Route path="skills" element={<AdminSkillsPage />} />
            <Route path="education" element={<AdminEducationPage />} />
            <Route path="achievements" element={<AdminAchievementsPage />} />
            <Route path="profile" element={<AdminProfilePage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
