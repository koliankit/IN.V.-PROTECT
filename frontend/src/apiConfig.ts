/**
 * API Configuration for Sangyan AI Investor Shield.
 * Handles automatic URL routing when deployed as a Render Static Site
 * communicating with a Render Web Service (FastAPI).
 */

export const API_BASE_URL: string = (
  (typeof import.meta !== 'undefined' && import.meta.env
    ? (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '')
    : '') as string
).replace(/\/+$/, '');

// Intercept global fetch to transparently prefix API requests if an external API_BASE_URL is configured
if (typeof window !== 'undefined' && API_BASE_URL) {
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    try {
      if (typeof input === 'string') {
        if (
          input.startsWith('/api') ||
          input.startsWith('/auth') ||
          input.startsWith('/devices') ||
          input.startsWith('/health')
        ) {
          input = `${API_BASE_URL}${input}`;
        }
      } else if (input instanceof URL) {
        if (
          input.pathname.startsWith('/api') ||
          input.pathname.startsWith('/auth') ||
          input.pathname.startsWith('/devices') ||
          input.pathname.startsWith('/health')
        ) {
          input = new URL(`${API_BASE_URL}${input.pathname}${input.search}`);
        }
      } else if (input instanceof Request) {
        const url = new URL(input.url, window.location.origin);
        if (
          url.pathname.startsWith('/api') ||
          url.pathname.startsWith('/auth') ||
          url.pathname.startsWith('/devices') ||
          url.pathname.startsWith('/health')
        ) {
          const targetUrl = `${API_BASE_URL}${url.pathname}${url.search}`;
          input = new Request(targetUrl, input);
        }
      }
    } catch {
      // In case of any URL parsing edge-cases, fallback to original input
    }
    return originalFetch(input, init);
  };
}
