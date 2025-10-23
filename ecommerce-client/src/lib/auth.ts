import { cookies } from 'next/headers';

const TOKEN_NAME = 'auth-token-ecommerce';
const TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Server-side token management
 */
export async function getServerToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_NAME)?.value;
}

export async function setServerToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set({
    name: TOKEN_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_MAX_AGE,
    path: '/',
  });
}

export async function removeServerToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

/**
 * Client-side token management
 * Note: These should be used via Server Actions, not directly in client components
 */
export const AUTH_CONFIG = {
  tokenName: TOKEN_NAME,
  maxAge: TOKEN_MAX_AGE,
} as const;
