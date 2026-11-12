import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ServiceListing } from '../pages/ServiceListing';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { BookingProvider } from '../context/BookingContext';

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <BookingProvider>
            <ServiceListing />
          </BookingProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

describe('Service Listing Screen', () => {
  it('renders package titles and allows searching by keyword', async () => {
    renderComponent();

    // Wait for services to load
    await waitFor(() => {
      expect(screen.getByText('Comprehensive General Service')).toBeInTheDocument();
    });

    expect(screen.getByText('Express Quick Service & Lube')).toBeInTheDocument();

    // Type in search bar
    const searchInput = screen.getByPlaceholderText(/Search packages/i);
    fireEvent.change(searchInput, { target: { value: 'Brake' } });

    await waitFor(() => {
      expect(screen.getByText(/Brake Overhaul/i)).toBeInTheDocument();
      expect(screen.queryByText('Express Quick Service & Lube')).not.toBeInTheDocument();
    });
  });

  it('filters by category and shows empty state when nothing matches', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Comprehensive General Service')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search packages/i);
    fireEvent.change(searchInput, { target: { value: 'NonExistentPackageXYZ' } });

    await waitFor(() => {
      expect(screen.getByText(/No service packages match your criteria/i)).toBeInTheDocument();
    });

    // Reset filters
    const resetBtn = screen.getByRole('button', { name: /Reset All Filters/i });
    fireEvent.click(resetBtn);

    await waitFor(() => {
      expect(screen.getByText('Comprehensive General Service')).toBeInTheDocument();
    });
  });
});
