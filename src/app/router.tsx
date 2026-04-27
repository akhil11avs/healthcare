import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';

const LoginPage = React.lazy(() => import('../features/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardPage = React.lazy(() => import('../features/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const AnalyticsPage = React.lazy(() => import('../features/analytics/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const PatientsPage = React.lazy(() => import('../features/patients/PatientsPage').then(m => ({ default: m.PatientsPage })));
const PatientDetailPage = React.lazy(() => import('../features/patients/PatientDetailPage').then(m => ({ default: m.PatientDetailPage })));



const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '200px' }}>
    <div className="app-loading-spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
  </div>
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/login',
    element: withSuspense(LoginPage),
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: withSuspense(DashboardPage) },
      { path: 'analytics', element: withSuspense(AnalyticsPage) },
      { path: 'patients', element: withSuspense(PatientsPage) },
      { path: 'patients/:id', element: withSuspense(PatientDetailPage) },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
