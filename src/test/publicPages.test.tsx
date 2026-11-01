import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AboutPage } from '../pages/AboutPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { CertificatesPage } from '../pages/CertificatesPage';
import { SkillsPage } from '../pages/SkillsPage';
import { EducationPage } from '../pages/EducationPage';
import { ContactPage } from '../pages/ContactPage';

describe('Public Page Rendering & Form Validation Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders About Page with architect profile information', async () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Architect Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/IDENTITY MATRIX/i)).toBeInTheDocument();
  });

  it('renders Projects Page with filters and project cards', async () => {
    render(
      <MemoryRouter>
        <ProjectsPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Software & Systems/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search projects or tech/i)).toBeInTheDocument();
  });

  it('renders Certificates Page with credential verification elements', async () => {
    render(
      <MemoryRouter>
        <CertificatesPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Certifications & Credentials/i)).toBeInTheDocument();
  });

  it('renders Skills Matrix Page with capability vectors', async () => {
    render(
      <MemoryRouter>
        <SkillsPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Engineering Capabilities/i)).toBeInTheDocument();
  });

  it('renders Education Page with academic records', async () => {
    render(
      <MemoryRouter>
        <EducationPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Education & Qualifications/i)).toBeInTheDocument();
  });

  it('validates contact form fields and prevents invalid submissions', async () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Initiate Contact/i)).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /Dispatch Message/i });
    fireEvent.click(submitBtn);

    // Errors should appear for name, email, subject, message
    await waitFor(() => {
      expect(screen.getByText(/Please provide your name/i)).toBeInTheDocument();
      expect(screen.getByText(/Please provide a valid email/i)).toBeInTheDocument();
    });
  });

  it('submits contact form successfully when valid details are provided', async () => {
    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>
    );

    const nameInput = screen.getByPlaceholderText(/e\.g\. Commander Shepard/i);
    const emailInput = screen.getByPlaceholderText(/e\.g\. shepard@alliance\.org/i);
    const subjectInput = screen.getByPlaceholderText(/e\.g\. Distributed Systems Architecture/i);
    const messageInput = screen.getByPlaceholderText(/Provide details regarding/i);

    fireEvent.change(nameInput, { target: { value: 'Alex Mercer' } });
    fireEvent.change(emailInput, { target: { value: 'alex@example.com' } });
    fireEvent.change(subjectInput, { target: { value: 'Architecture Collaboration' } });
    fireEvent.change(messageInput, { target: { value: 'I would like to discuss engineering opportunities in distributed telemetry systems.' } });

    const submitBtn = screen.getByRole('button', { name: /Dispatch Message/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Transmission Acknowledged/i)).toBeInTheDocument();
    });
  });
});
