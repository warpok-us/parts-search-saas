import { HttpClient, HttpRequestOptions, HttpResponse, HttpMethod } from '../contracts/index.js';
import { NetworkError } from '../errors.js';

/**
 * Concrete HTTP client implementation using fetch API
 * Follows Single Responsibility Principle - only handles HTTP requests
 */
export class FetchHttpClient implements HttpClient {
  async request<T>(options: HttpRequestOptions): Promise<HttpResponse<T>> {
    const { url, method, headers = {}, body, timeout = 5000, signal } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Use provided signal or create new one
    const requestSignal = signal || controller.signal;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: requestSignal,
      });

      clearTimeout(timeoutId);

      let data: T;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        // For non-JSON responses (like DELETE), return empty object
        data = {} as T;
      }

      // Convert headers to plain object
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new NetworkError('Network connection failed. Please check your internet connection.');
      }
      throw error;
    }
  }
}
