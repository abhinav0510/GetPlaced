const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("getplaced_token");
  const headers = { ...options.headers };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = "API request failed";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // JSON parse error
    }
    throw new Error(errorMessage);
  }

  if (response.status === 24 || response.headers.get("content-length") === "0") {
    return null;
  }

  return response.json();
}

export function getFileUrl(path) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `http://localhost:8080${path}`;
}
