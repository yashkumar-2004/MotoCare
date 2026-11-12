import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MultiStepBooking } from '../pages/MultiStepBooking';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { BookingProvider } from '../context/BookingContext';

const renderBookingPage = () => {
  return render(
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <BookingProvider>
            <MultiStepBooking />
          </BookingProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

describe('Multi-Step Booking Flow', () => {
  it('renders Step 1 with vehicle selection and progresses through the wizard', async () => {
    renderBookingPage();

    // Step 1: Select vehicle
    await waitFor(() => {
      expect(screen.getByText(/Step 1: Select Your Two-Wheeler/i)).toBeInTheDocument();
    });

    // Wait for the registered vehicle card to load
    await waitFor(() => {
      expect(screen.getByText(/DL 03 CB 4192/i)).toBeInTheDocument();
    });

    // Verify Continue button is enabled and click it
    const continueBtn = screen.getByRole('button', { name: /Continue to Select Service/i });
    expect(continueBtn).not.toBeDisabled();
    fireEvent.click(continueBtn);

    // Step 2: Choose Service & Value Add-ons
    await waitFor(() => {
      expect(screen.getByText(/Step 2: Choose Service & Value Add-ons/i)).toBeInTheDocument();
    });

    // Wait for services to finish loading
    const step2ContinueBtn = await screen.findByRole('button', { name: /Continue to Select Slot/i });
    expect(step2ContinueBtn).toBeInTheDocument();
    fireEvent.click(step2ContinueBtn);

    // Step 3: Choose appointment
    await waitFor(() => {
      expect(screen.getByText(/Step 3: Select Service Centre & Bay Slot/i)).toBeInTheDocument();
    });
  });
});
