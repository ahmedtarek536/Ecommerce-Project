// Centralized API client with error handling, retries, and caching

const API_BASE_URL = "http://ecommerce232.runasp.net";
const DEFAULT_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 2;

interface RequestConfig extends RequestInit {
  timeout?: number;
  retries?: number;
  skipAuth?: boolean;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiError extends Error {
  constructor(message: string, public status?: number, public data?: any) {
    super(message);
    this.name = "ApiError";
  }
}

// Request deduplication cache
const pendingRequests = new Map<string, Promise<any>>();

async function fetchWithTimeout(
  url: string,
  options: RequestConfig = {}
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("Request timeout", 408);
    }
    throw error;
  }
}

async function apiRequest<T = any>(
  endpoint: string,
  options: RequestConfig = {}
): Promise<ApiResponse<T>> {
  const {
    retries = MAX_RETRIES,
    skipAuth = false,
    headers = {},
    ...fetchOptions
  } = options;

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  // Create a unique key for request deduplication
  const requestKey = `${fetchOptions.method || "GET"}_${url}_${JSON.stringify(
    fetchOptions.body || ""
  )}`;

  // Check if there's already a pending request
  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey);
  }

  const requestPromise = (async () => {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetchWithTimeout(url, {
          ...fetchOptions,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
        });

        // Handle non-OK responses
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage =
            errorData.message ||
            errorData.Message ||
            `HTTP ${response.status}: ${response.statusText}`;
          console.error("API Error:", {
            status: response.status,
            url: url,
            errorData: errorData,
          });
          throw new ApiError(errorMessage, response.status, errorData);
        }

        const data = await response.json();

        // Remove from pending requests
        pendingRequests.delete(requestKey);

        return data as ApiResponse<T>;
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx) except 408 (timeout)
        if (
          error instanceof ApiError &&
          error.status &&
          error.status >= 400 &&
          error.status < 500 &&
          error.status !== 408
        ) {
          break;
        }

        // Wait before retrying (exponential backoff)
        if (attempt < retries) {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, attempt) * 1000)
          );
        }
      }
    }

    // Remove from pending requests on failure
    pendingRequests.delete(requestKey);

    // If all retries failed, throw the last error
    if (lastError instanceof ApiError) {
      throw lastError;
    }

    throw new ApiError(
      lastError?.message || "An unexpected error occurred",
      undefined,
      lastError
    );
  })();

  // Store the promise for deduplication
  pendingRequests.set(requestKey, requestPromise);

  return requestPromise;
}

// Convenience methods
export const apiClient = {
  get: <T = any>(endpoint: string, token?: string, config?: RequestConfig) =>
    apiRequest<T>(endpoint, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      ...config,
    }),

  post: <T = any>(
    endpoint: string,
    body?: any,
    token?: string,
    config?: RequestConfig
  ) =>
    apiRequest<T>(endpoint, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: body ? JSON.stringify(body) : undefined,
      ...config,
    }),

  put: <T = any>(
    endpoint: string,
    body?: any,
    token?: string,
    config?: RequestConfig
  ) =>
    apiRequest<T>(endpoint, {
      method: "PUT",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: body ? JSON.stringify(body) : undefined,
      ...config,
    }),

  delete: <T = any>(endpoint: string, token?: string, config?: RequestConfig) =>
    apiRequest<T>(endpoint, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      ...config,
    }),

  patch: <T = any>(
    endpoint: string,
    body?: any,
    token?: string,
    config?: RequestConfig
  ) =>
    apiRequest<T>(endpoint, {
      method: "PATCH",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: body ? JSON.stringify(body) : undefined,
      ...config,
    }),
};

export { ApiError };
export type { ApiResponse };
