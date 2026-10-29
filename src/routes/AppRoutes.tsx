import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { AdminLayout } from '../layouts/AdminLayout';
import { DriverLayout } from '../layouts/DriverLayout';
import { ParentLayout } from '../layouts/ParentLayout';

// Role Selector Launcher
import { RoleSelectorPage } from '../pages/RoleSelectorPage';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { BusManagement } from '../pages/admin/BusManagement';
import { BusDetails } from '../pages/admin/BusDetails';
import { DriverManagement } from '../pages/admin/DriverManagement';
import { ParentStudentManagement } from '../pages/admin/ParentStudentManagement';
import { RouteManagement } from '../pages/admin/RouteManagement';
import { StopManagement } from '../pages/admin/StopManagement';
import { TripMonitoring } from '../pages/admin/TripMonitoring';
import { OperationalAlerts } from '../pages/admin/OperationalAlerts';

// Driver Pages
import { DriverHome } from '../pages/driver/DriverHome';
import { DriverRouteStops } from '../pages/driver/DriverRouteStops';
import { DriverProfile } from '../pages/driver/DriverProfile';

// Parent Pages
import { ParentDashboard } from '../pages/parent/ParentDashboard';
import { ParentExploreBuses } from '../pages/parent/ParentExploreBuses';
import { ParentBusDetails } from '../pages/parent/ParentBusDetails';
import { ParentNotifications } from '../pages/parent/ParentNotifications';
import { ParentProfile } from '../pages/parent/ParentProfile';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Root Prototype Launcher */}
      <Route path="/" element={<RoleSelectorPage />} />

      {/* Admin Panel (Desktop-first) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="buses" element={<BusManagement />} />
        <Route path="buses/:id" element={<BusDetails />} />
        <Route path="drivers" element={<DriverManagement />} />
        <Route path="parents-students" element={<ParentStudentManagement />} />
        <Route path="routes" element={<RouteManagement />} />
        <Route path="stops" element={<StopManagement />} />
        <Route path="trips" element={<TripMonitoring />} />
        <Route path="alerts" element={<OperationalAlerts />} />
      </Route>

      {/* Driver Panel (Mobile-first) */}
      <Route path="/driver" element={<DriverLayout />}>
        <Route index element={<DriverHome />} />
        <Route path="stops" element={<DriverRouteStops />} />
        <Route path="profile" element={<DriverProfile />} />
      </Route>

      {/* Parent Panel (Mobile-first) */}
      <Route path="/parent" element={<ParentLayout />}>
        <Route index element={<ParentDashboard />} />
        <Route path="explore" element={<ParentExploreBuses />} />
        <Route path="buses/:id" element={<ParentBusDetails />} />
        <Route path="notifications" element={<ParentNotifications />} />
        <Route path="profile" element={<ParentProfile />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

