// API client placeholder
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api'

export type ApiResponse<T> = {
  data?: T
  error?: string
  status: number
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
}

function buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
  const url = new URL(path, window.location.origin)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value))
    })
  }

  // If path doesn't start with http, prepend API_BASE_URL
  if (!path.startsWith('http')) {
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`
  }

  return url.toString()
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { params, ...fetchOptions } = options
  const url = buildUrl(path, params)

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  })

  const status = response.status

  try {
    const data = await response.json()
    if (!response.ok) {
      return { error: data.error || 'An error occurred', status }
    }
    return { data, status }
  } catch {
    if (!response.ok) {
      return { error: 'An error occurred', status }
    }
    return { status }
  }
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  patch: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}
