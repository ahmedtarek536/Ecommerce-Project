'use server';

import { cookies } from 'next/headers';
import { authService } from '@/services/authService';

const TOKEN_NAME = 'auth-token-ecommerce';
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthResult {
  success: boolean;
  message?: string;
  data?: any;
}

/**
 * Server action for login
 */
export async function loginAction(credentials: LoginCredentials): Promise<AuthResult> {
  try {
    const response = await authService.login(credentials);
    
    if (response.success && response.data) {
      const cookieStore = await cookies();
      cookieStore.set({
        name: TOKEN_NAME,
        value: response.data,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: TOKEN_MAX_AGE,
        path: '/',
      });
      
      return { success: true, data: response.data };
    }
    
    return { success: false, message: response.message || 'Login failed' };
  } catch (error: any) {
    console.error('Login error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'An error occurred during login' 
    };
  }
}

/**
 * Server action for signup
 */
export async function signupAction(credentials: SignupCredentials): Promise<AuthResult> {
  try {
    const response = await authService.signup(credentials);
    
    if (response.success && response.data) {
      const cookieStore = await cookies();
      cookieStore.set({
        name: TOKEN_NAME,
        value: response.data,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: TOKEN_MAX_AGE,
        path: '/',
      });
      
      return { success: true, data: response.data };
    }
    
    return { success: false, message: response.message || 'Signup failed' };
  } catch (error: any) {
    console.error('Signup error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'An error occurred during signup' 
    };
  }
}

/**
 * Server action for Google login
 */
export async function googleLoginAction(credential: string): Promise<AuthResult> {
  try {
    const response: any = await authService.googleLogin(credential);
    
    if (response.token) {
      const cookieStore = await cookies();
      cookieStore.set({
        name: TOKEN_NAME,
        value: response.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: TOKEN_MAX_AGE,
        path: '/',
      });
      
      return { success: true, data: response };
    }
    
    return { success: false, message: 'Google login failed' };
  } catch (error: any) {
    console.error('Google login error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'An error occurred during Google login' 
    };
  }
}

/**
 * Server action for Facebook login
 */
export async function facebookLoginAction(accessToken: string, userID: string): Promise<AuthResult> {
  try {
    const response: any = await authService.facebookLogin(accessToken, userID);
    
    if (response.token) {
      const cookieStore = await cookies();
      cookieStore.set({
        name: TOKEN_NAME,
        value: response.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: TOKEN_MAX_AGE,
        path: '/',
      });
      
      return { success: true, data: response };
    }
    
    return { success: false, message: 'Facebook login failed' };
  } catch (error: any) {
    console.error('Facebook login error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'An error occurred during Facebook login' 
    };
  }
}

/**
 * Server action for logout
 */
export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
  
  try {
    await authService.logout();
  } catch (error) {
    console.error('Logout error:', error);
  }
}

/**
 * Get current authentication token
 */
export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_NAME)?.value;
}
