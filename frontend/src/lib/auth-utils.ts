/**
 * Authentication utility functions for checking user authentication status
 */

import { authApi } from './api';

let cachedUser: any = null;
let isChecking = false;
let checkPromise: Promise<any> | null = null;

/**
 * Checks if the user is authenticated
 * @returns Promise that resolves to user object if authenticated, null otherwise
 */
export async function checkAuth(): Promise<any> {
  // Return cached user if available
  if (cachedUser) {
    return cachedUser;
  }

  // If already checking, return the existing promise
  if (isChecking && checkPromise) {
    return checkPromise;
  }

  // Start new check
  isChecking = true;
  checkPromise = (async () => {
    try {
      const response = await authApi.getMe();
      if (response.success && response.user) {
        cachedUser = response.user;
        return response.user;
      }
      cachedUser = null;
      return null;
    } catch (error) {
      cachedUser = null;
      return null;
    } finally {
      isChecking = false;
      checkPromise = null;
    }
  })();

  return checkPromise;
}

/**
 * Clears the cached user (call this on logout)
 */
export function clearAuthCache(): void {
  cachedUser = null;
}

/**
 * Checks if user is authenticated synchronously (uses cache)
 * @returns User object if authenticated, null otherwise
 */
export function getCachedUser(): any {
  return cachedUser;
}

/**
 * Checks if user is authenticated and is a regular user (not admin)
 * @returns Promise that resolves to true if user is authenticated and is a regular user
 */
export async function isUserAuthenticated(): Promise<boolean> {
  const user = await checkAuth();
  return user !== null && user.role === 'user';
}

