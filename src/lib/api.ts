const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  // Parse JSON response body if available (both for success and error bodies)
  let responseData: any = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      responseData = await response.json();
    } catch (e) {
      console.error("Failed to parse response body as JSON", e);
    }
  }

  if (!response.ok) {
    // Attempt to extract descriptive error message from backend response
    let errorMessage = `API request failed: ${response.status}`;
    if (responseData) {
      if (typeof responseData === "object") {
        if (responseData.detail) {
          errorMessage = responseData.detail;
        } else if (responseData.error) {
          errorMessage = responseData.error;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.non_field_errors) {
          errorMessage = Array.isArray(responseData.non_field_errors)
            ? responseData.non_field_errors.join(", ")
            : responseData.non_field_errors;
        }
      } else if (typeof responseData === "string") {
        errorMessage = responseData;
      }
    }
    throw new ApiError(response.status, errorMessage, responseData);
  }

  return responseData as T;
}

function getCookie(name: string) {
  const cookie = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

function isUnsafeMethod(method?: string) {
  const normalizeMethod = method?.toUpperCase() ?? "GET";
  return !["GET", "HEAD", "OPTIONS", "TRACE"].includes(normalizeMethod)
}

function getCsrfHeaders(init?: RequestInit): HeadersInit {
  if (!isUnsafeMethod(init?.method)) return {};
  const csrfToken = getCookie("csrftoken")
  return csrfToken ? {"X-CSRFTOKEN": csrfToken} : {}
}

   async function fetchWithRetry(url: string, init?: RequestInit): Promise<Response> {                                                                                                                  
      let response = await fetch(url, init);
      const isAuthOrRefreshRoute =                                                                                                                                                                       
        url.endsWith("/api/auth/refresh/") ||                                                                                                                                                            
        url.endsWith("/api/auth/signin/") ||                                                                                                                                                             
        url.endsWith("/api/auth/signup/") ||                                                                                                                                                             
        url.endsWith("/api/auth/logout/");
      // Trigger retry on 401, but not if the request is already an auth action                                                                                                                          
      if (response.status === 401 && !isAuthOrRefreshRoute) {                                                                                                                                            
        try {                                                                                                                                                                                            
          // Dynamic import to prevent circular dependency                                                                                                                                               
          const { refreshSession } = await import("@/features/auth/api/auth.api");                                                                                                                       
          await refreshSession();
          // Retry the original request                                                                                                                                                                  
          response = await fetch(url, init);                                                                                                                                                             
        } catch (error) {                                                                                                                                                                                
          console.error("Silent token refresh failed, logging out:", error);                                                                                                                             
          const { queryClient } = await import("@/lib/query-client");                                                                                                                                    
          queryClient.clear();                                                                                                                                                                           
          // Optionally redirect to login immediately if not already there
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }                                                                                                                                        
        }                                                                                                                                                                                                
      }                                                                                                                                                                           
      return response;                                                                                                                                                                                   
    } 

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetchWithRetry(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...getCsrfHeaders(init),
      ...(init?.headers ?? {}),
    },
    credentials: "include",
  });

  return parseApiResponse<T>(response);
}

export async function apiFormData<T>(
  path: string,
  formData: FormData,
  init?: Omit<RequestInit, "body">,
): Promise<T> {
  const method = init?.method ?? "POST";
  const response = await fetchWithRetry(`${API_BASE_URL}${path}`, {
    ...init,
    method,
    body: formData,
    headers: {
      ...getCsrfHeaders({...init, method}),
      ...(init?.headers ?? {}),
    },
    credentials: "include",
  });

  return parseApiResponse<T>(response);
}
