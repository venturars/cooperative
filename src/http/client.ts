import type { HttpClient } from "./types";

/** Configuration for {@link createFetchHttpClient}. */
interface FetchHttpClientConfig {
  baseUrl: string;
  defaultHeaders?: HeadersInit;
}

/** Joins a base URL and path with a single slash boundary. */
function joinUrl(baseUrl: string, path: string): string {
  const base = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

/** Parses JSON on success; on HTTP error throws with status and optional `error` body field. */
async function parseJson<T>(
  response: Response,
  fallbackError: string,
): Promise<T> {
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as {
      error?: string;
    };
    const detail = body.error ?? response.statusText;
    throw new Error(`${fallbackError}: ${response.status} ${detail}`);
  }
  return (await response.json()) as T;
}

/**
 * Creates an {@link HttpClient} backed by `fetch`, with JSON bodies and shared default headers.
 *
 * @param config - Base URL (trailing slash optional) and optional headers for every request.
 */
export function createFetchHttpClient(
  config: FetchHttpClientConfig,
): HttpClient {
  return {
    async get<T>(path: string, init?: RequestInit): Promise<T> {
      const response = await fetch(joinUrl(config.baseUrl, path), {
        ...init,
        method: "GET",
        headers: {
          ...config.defaultHeaders,
          ...(init?.headers ?? {}),
        },
      });
      return parseJson<T>(response, "HTTP GET request failed");
    },

    async post<T>(path: string, init?: RequestInit): Promise<T> {
      const response = await fetch(joinUrl(config.baseUrl, path), {
        ...init,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...config.defaultHeaders,
          ...(init?.headers ?? {}),
        },
      });
      return parseJson<T>(response, "HTTP POST request failed");
    },
  };
}
