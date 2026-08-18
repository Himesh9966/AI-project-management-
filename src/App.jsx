/**
 * CONCEPTS USED:
 * - React Context Provider Wrapper
 * - Component Composition
 *
 * PURPOSE:
 * Root application component mounting providers and routes.
 */

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
