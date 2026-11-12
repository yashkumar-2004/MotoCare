import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Lazy-loaded routes for performance optimization
const HomeDashboard = lazy(() =>
  import('../pages/HomeDashboard').then((m) => ({ default: m.HomeDashboard }))
);
const ServiceListing = lazy(() =>
  import('../pages/ServiceListing').then((m) => ({ default: m.ServiceListing }))
);
const ServiceDetails = lazy(() =>
  import('../pages/ServiceDetails').then((m) => ({ default: m.ServiceDetails }))
);
const MultiStepBooking = lazy(() =>
  import('../pages/MultiStepBooking').then((m) => ({ default: m.MultiStepBooking }))
);
const UserProfile = lazy(() =>
  import('../pages/UserProfile').then((m) => ({ default: m.UserProfile }))
);
const AdminDashboard = lazy(() =>
  import('../pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const NotFound = lazy(() =>
  import('../pages/NotFound').then((m) => ({ default: m.NotFound }))
);

const RouteLoadingFallback = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
    <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    <span className="text-xs font-semibold text-slate-500">Loading MotoCare view...</span>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomeDashboard />} />
          <Route path="services" element={<ServiceListing />} />
          <Route path="services/:id" element={<ServiceDetails />} />
          <Route path="booking" element={<MultiStepBooking />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
