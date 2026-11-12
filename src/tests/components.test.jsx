import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DashboardCard } from '../components/cards/DashboardCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { Modal } from '../components/common/Modal';
import { VehicleCard, VehiclePlaceholder } from '../components/cards/VehicleCard';
import { BookingProvider } from '../context/BookingContext';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import { Wrench } from 'lucide-react';

const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <BookingProvider>
            {ui}
          </BookingProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

describe('Core Reusable Components', () => {
  it('renders DashboardCard with title, value and subtitle correctly', () => {
    render(
      <DashboardCard
        title="Active Bays"
        value={12}
        subtitle="Across Delhi NCR"
        icon={Wrench}
        color="blue"
      />
    );
    expect(screen.getByText('Active Bays')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('Across Delhi NCR')).toBeInTheDocument();
  });

  it('renders StatusBadge with right status color classes', () => {
    const { rerender } = render(<StatusBadge status="Confirmed" />);
    expect(screen.getByText('Confirmed')).toBeInTheDocument();

    rerender(<StatusBadge status="In Service" />);
    expect(screen.getByText('In Service')).toBeInTheDocument();

    rerender(<StatusBadge status="Completed" />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders EmptyState with action button and handles click', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="No Bookings Found"
        description="Your schedule is completely clear."
        actionLabel="Book a Service"
        onAction={handleAction}
      />
    );
    expect(screen.getByText('No Bookings Found')).toBeInTheDocument();
    expect(screen.getByText('Your schedule is completely clear.')).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /Book a Service/i });
    fireEvent.click(button);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('renders ErrorState with message and retry trigger', () => {
    const handleRetry = vi.fn();
    render(
      <ErrorState
        title="Network Error"
        message="Could not reach Delhi workshop servers."
        onRetry={handleRetry}
      />
    );
    expect(screen.getByText('Network Error')).toBeInTheDocument();
    expect(screen.getByText('Could not reach Delhi workshop servers.')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /Retry Action/i });
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('renders Modal when isOpen is true and closes on Esc or click', () => {
    const handleClose = vi.fn();
    const { rerender } = render(
      <Modal isOpen={false} onClose={handleClose} title="Service Schedule">
        <div>Modal content</div>
      </Modal>
    );
    expect(screen.queryByText('Service Schedule')).not.toBeInTheDocument();

    rerender(
      <Modal isOpen={true} onClose={handleClose} title="Service Schedule">
        <div>Modal content</div>
      </Modal>
    );
    expect(screen.getByText('Service Schedule')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('Close dialog'));
    expect(handleClose).toHaveBeenCalled();
  });

  it('renders VehicleCard and handles missing image with fallback placeholder', () => {
    const mockVehicle = {
      id: 'veh_test_1',
      brand: 'Royal Enfield',
      model: 'Hunter 350',
      regNumber: 'DL 01 AB 9999',
      type: 'Cruiser',
      odometer: 4500,
      image: '', // Missing image to trigger fallback!
    };

    renderWithProviders(<VehicleCard vehicle={mockVehicle} />);
    expect(screen.getByText('Royal Enfield Hunter 350')).toBeInTheDocument();
    expect(screen.getByText('DL 01 AB 9999')).toBeInTheDocument();
    expect(screen.getByText('MotoCare Registered Ride')).toBeInTheDocument();
  });
});
