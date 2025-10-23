"use client";

import { useState } from "react";

/**
 * Hook to get token from server-side
 * This should be used with a server action that fetches the token
 */
export function useServerToken(initialToken?: string) {
  const [token, setToken] = useState<string | undefined>(initialToken);

  return { token, setToken };
}
