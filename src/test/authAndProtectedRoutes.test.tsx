import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from '../components/navigation/ProtectedRoute';
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';

const DummyAdminProtectedComponent = () => <div>SECURE ADMIN CONSOLE REACHED</div>;

describe('Authentication & Protected Route Enforcement Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('rejects invalid administrator credentials with appropriate error message', async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/admin/login']}>
          <Routes>
            <Route path="/admin/login" element={<AdminLoginPage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    const emailInput = screen.getByPlaceholderText('admin@nexus.io');
    const passwordInput = screen.getByPlaceholderText('••••••••••••');
    const submitBtn = screen.getByRole('button', { name: /Authenticate Session/i });

    fireEvent.change(emailInput, { target: { value: 'intruder@badactor.net' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Invalid administrator credentials/i)).toBeInTheDocument();
    });
  });

  it('redirects unauthenticated visitors away from protected admin routes to /admin/login', async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <Routes>
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <DummyAdminProtectedComponent />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/login" element={<div>ADMIN LOGIN SCREEN</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    // Protected component should NOT be rendered; visitor must be redirected to login screen
    await waitFor(() => {
      expect(screen.queryByText('SECURE ADMIN CONSOLE REACHED')).not.toBeInTheDocument();
      expect(screen.getByText('ADMIN LOGIN SCREEN')).toBeInTheDocument();
    });
  });

  it('allows authenticated administrator to access protected routes', async () => {
    // Pre-populate authenticated session in localStorage
    localStorage.setItem(
      'nexus_admin_session',
      JSON.stringify({ id: 'test-admin-id', email: 'admin@nexus.io', role: 'admin' })
    );

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/admin/dashboard']}>
          <Routes>
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <DummyAdminProtectedComponent />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/login" element={<div>ADMIN LOGIN SCREEN</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('SECURE ADMIN CONSOLE REACHED')).toBeInTheDocument();
    });
  });
});
