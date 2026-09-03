/**
 * CONCEPTS USED:
 * - Custom React Hooks
 * - React Context consumption
 *
 * PURPOSE:
 * Syntactic sugar for consuming AuthContext.
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
