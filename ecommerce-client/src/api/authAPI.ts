import { apiClient } from '@/utils/apiClient';

export async function signin(email: string, password: string) {
  try {
    return await apiClient.post('/api/Customers/auth-login', { email, password });
  } catch (error) {
    console.error('Error signing in:', error);
    return { success: false, message: 'Failed to sign in. Please check your credentials.' };
  }
}

export async function signup(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  try {
    return await apiClient.post('/api/Customers/auth-signup', {
      firstName,
      lastName,
      email,
      password,
    });
  } catch (error) {
    console.error('Error signing up:', error);
    return { success: false, message: 'Failed to create account. Please try again.' };
  }
}

export async function logout() {
  try {
    return await apiClient.post('/api/Customers/auth-logout');
  } catch (error) {
    console.error('Error logging out:', error);
    return { success: false, message: 'Failed to logout' };
  }
}
