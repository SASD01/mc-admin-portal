type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions<TBody> = {
  body?: TBody;
  headers?: HeadersInit;
};

const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

async function request<TResponse, TBody = unknown>(
  method: HttpMethod,
  path: string,
  options: RequestOptions<TBody> = {},
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'include',
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) return undefined as TResponse;
  return response.json() as Promise<TResponse>;
}

export const httpClient = {
  get: <TResponse>(path: string, options?: RequestOptions<never>) => request<TResponse>('GET', path, options),
  post: <TResponse, TBody>(path: string, body: TBody) => request<TResponse, TBody>('POST', path, { body }),
  put: <TResponse, TBody>(path: string, body: TBody) => request<TResponse, TBody>('PUT', path, { body }),
  patch: <TResponse, TBody>(path: string, body: TBody) => request<TResponse, TBody>('PATCH', path, { body }),
  delete: <TResponse>(path: string) => request<TResponse>('DELETE', path),
};
