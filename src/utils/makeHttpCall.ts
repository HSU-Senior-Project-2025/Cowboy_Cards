type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type CredentialOptions = 'include' | 'omit' | 'same-origin';

// Interface defining the structure of options that can be passed to fetch requests
interface FetchOptions {
  method: HttpMethod;
  headers: any;
  credentials?: CredentialOptions;
}

const defaultOpts: FetchOptions = {
  method: 'GET',
  headers: {},
  credentials: 'include',
};

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
    const response = await fetch(url, finalOpts);

    // Check if the response was successful (status 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // all responses should be json now
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
