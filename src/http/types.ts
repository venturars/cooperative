/** Minimal HTTP client used by the SDK to call the Cooperative API (`GET` / `POST` JSON). */
export interface HttpClient {
  get<T>(path: string, init?: RequestInit): Promise<T>;
  post<T>(path: string, init?: RequestInit): Promise<T>;
}
