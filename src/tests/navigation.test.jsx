import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';
import { BookingProvider } from '../context/BookingContext';
import { AppRoutes } from '../routes/AppRoutes';

const renderRoute = (initialPath) => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <ToastProvider>
        <AuthProvider>
          <BookingProvider>
            <AppRoutes />
          </BookingProvider>
        </AuthProvider>
      </ToastProvider>
    </MemoryRouter>
  );
};

describe('Client-Side Navigation & Routing', () => {
  it('renders Home Dashboard on root / route', async () => {
    renderRoute('/');
    await waitFor(() => {
      expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
      expect(screen.getByText(/Delhi NCR Authorized Dealership Network/i)).toBeInTheDocument();
    });
  });

  it('renders Service Catalog on /services route', async () => {
    renderRoute('/services');
    await waitFor(() => {
      expect(screen.getByText(/Two-Wheeler Service Packages/i)).toBeInTheDocument();
    });
  });

  it('renders Multi-step Booking on /booking route', async () => {
    renderRoute('/booking');
    await waitFor(() => {
      expect(screen.getByText(/Book Service Bay Appointment/i)).toBeInTheDocument();
    });
  });

  it('renders User Profile on /profile route', async () => {
    renderRoute('/profile');
    await waitFor(() => {
      expect(screen.getByText(/My Registered Rides/i)).toBeInTheDocument();
    });
  });

  it('renders Admin Command Center on /admin route', async () => {
    renderRoute('/admin');
    await waitFor(() => {
      expect(screen.getByText(/Delhi NCR Service Operations/i)).toBeInTheDocument();
    });
  });

  it('renders 404 page for unknown routes', async () => {
    renderRoute('/unknown-nonexistent-path');
    await waitFor(() => {
      expect(screen.getByText(/404 - Page Not Found/i)).toBeInTheDocument();
    });
  });
});
