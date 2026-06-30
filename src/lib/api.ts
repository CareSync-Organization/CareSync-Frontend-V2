const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

type ApiErrorData = Record<string, unknown> | string | null
let csrfToken: string | null = null;

export class ApiError extends Error {
  status: number;
  data: ApiErrorData;

  constructor(status: number, message: string, data: ApiErrorData = null) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

function isUnsafeMethod(method = "GET") {
  return !["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase());
}

function getCookie(name: string) {
  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

  return value ? decodeURIComponent(value) : null;
}


async function fetchCsrfToken() {
  const response = await fetch(`${API_BASE_URL}/api/auth/csrf/`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new ApiError(response.status, "Could not fetch CSRF token.");
  }

  const data = (await response.json()) as { csrfToken?: string };

  if (!data.csrfToken) {
    throw new ApiError(response.status, "CSRF token response was empty.");
  }

  csrfToken = data.csrfToken;
  return csrfToken;
}

async function getCsrfToken() {
  const cookieToken = getCookie("csrftoken");
  if (cookieToken) {
    csrfToken = cookieToken;
    return cookieToken;
  }

  return csrfToken ?? fetchCsrfToken();
}

async function buildHeaders(init?: RequestInit) {
  const headers = new Headers(init?.headers);
  if (!(init?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json")
  }
  if (isUnsafeMethod(init?.method)) {
    headers.set("X-CSRFToken", await getCsrfToken());
  }
  return headers;
}

async function parseResponseBody(response: Response) {
  if (response.status === 204) return null;
  const contentType = response.headers.get("content-type")
  if (contentType?.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

function getErrorMessage(data: ApiErrorData, status: number) {
  if (status >= 500) return "Something went wrong on our end. Please try again.";
  if (data) {
    if (typeof data === "string") return data;
    if (typeof data === "object") {
      if (typeof data.detail === "string") return data.detail;
      if (typeof data.error === "string") return data.error;
      if (typeof data.message === "string") return data.message;
      if (Array.isArray(data.non_field_errors)) return data.non_field_errors.join(", ");
    }
  }
  if (status === 0) return "Unable to connect. Please check your internet connection and try again.";
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403) return "You don't have permission to perform this action.";
  if (status === 404) return "The requested resource was not found.";
  return "Something went wrong. Please try again.";
}

function isAuthEndpoint(path: string) {
  return [
    "/api/auth/signin/",
    "/api/auth/signup/",
    "/api/auth/refresh/",
    "/api/auth/logout/"
  ].includes(path)
}

let refreshPromise: Promise<void> | null = null;

async function refreshSession() {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const headers = await buildHeaders({ method: "POST" });
      const response = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
        method: "POST",
        headers,
        credentials: "include",
      });
      if (!response.ok) {
        const data = await parseResponseBody(response);
        throw new ApiError(response.status, getErrorMessage(data, response.status), data);
      }
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}


async function safeFetch(input: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch {
    throw new ApiError(0, getErrorMessage(null, 0));
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = await buildHeaders(init);

  const requestInit: RequestInit = {
    ...init,
    headers,
    credentials: "include",
  };

  let response = await safeFetch(`${API_BASE_URL}${path}`, requestInit);

  if (response.status === 401 && !isAuthEndpoint(path)) {
    await refreshSession();
    response = await safeFetch(`${API_BASE_URL}${path}`, requestInit);
  }

  if (response.status === 403 && isUnsafeMethod(init.method)) {
    csrfToken = null;
    response = await safeFetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: await buildHeaders(init),
      credentials: "include",
    });
  }

  const data = await parseResponseBody(response);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      getErrorMessage(data, response.status),
      data,
    );
  }

  return data as T;
}

export function api<T>(path: string, init: RequestInit = {}) {
  return request<T>(path, init);
}

export function apiFormData<T>(
  path: string,
  formData: FormData,
  init: Omit<RequestInit, "body"> = {},
) {
  return request<T>(path, {
    ...init,
    method: init.method ?? "POST",
    body: formData,
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function getApiFieldError(error: unknown, field: string) {
  if (!(error instanceof ApiError)) return undefined;
  if (!isRecord(error.data)) return undefined;

  const value = error.data[field];

  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "string") return value;

  return undefined;
}
