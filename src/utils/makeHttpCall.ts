type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type CredentialOptions = 'include' | 'omit' | 'same-origin';

// Interface defining the structure of options that can be passed to fetch requests
interface FetchOptions {
  method: HttpMethod; // eslint-disable-next-line
  headers: any;
  credentials?: CredentialOptions;
  body?: string; //JSON
}

const defaultOpts: FetchOptions = {
  method: 'GET',
  headers: {},
  credentials: 'include', //dev only, remove in prod same origin
};

const API_BASE = import.meta.env.VITE_API_BASE;

/**
 * Universal fetch utility for making HTTP requests
 * This is a wrapper around the native fetch API that provides consistent error handling
 * and response parsing
 * Can return any type of data
 *
 * @param url The URL to fetch from
 * @param options Request options including method, headers, and body
 * @returns Promise with the parsed response data
 */
export async function makeHttpCall<T>(
  url: string = '',
  options: FetchOptions = defaultOpts
): Promise<T> {
  const finalOpts = {
    ...defaultOpts,
    ...options,
  };
  try {
    // Make the actual HTTP request
    const response = await fetch(API_BASE + url, finalOpts);

    // Check if the req failed: 4xx, 5xx
    if (!response.ok) {
      const msg = await response.text();

      throw new Error(
        `HTTP error! Status: ${response.status}, Message: ${msg}`
      );
    }

    // Handle 204 No Content specifically
    if (response.status === 204) {
      return null as T; // Return null or appropriate value for no content
    }

    // For other successful responses, parse JSON
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
