import type { DemoPersona, SimulationRequest, SimulationResponse } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_DAEDALUS_API_URL ||
  "http://localhost:8000";

function formatApiError(data: any, fallback: string) {
  if (data?.error?.message) return data.error.message;
  if (typeof data?.detail === "string") return data.detail;
  if (Array.isArray(data?.detail)) {
    return data.detail
      .map((item: any) => {
        const field = Array.isArray(item.loc) ? item.loc.slice(1).join(".") : "field";
        return `${field}: ${item.msg}`;
      })
      .join("; ");
  }
  return fallback;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(init?.headers || {}),
      },
    });
  } catch {
    throw new Error(
      `Cannot reach Daedalus backend at ${API_BASE_URL}. Check that the backend is running and NEXT_PUBLIC_API_BASE_URL is correct.`
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(formatApiError(data, "Daedalus API request failed."));
  }

  return data as T;
}

export function getHealth() {
  return request<{ success: boolean; status: string; service: string; version: string }>("/api/v1/health");
}

export function getDemoPersonas() {
  return request<{ success: true; personas: DemoPersona[] }>("/api/v1/demo-personas");
}

export function simulateCareerPaths(payload: SimulationRequest) {
  return request<SimulationResponse>("/api/v1/simulate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getSimulationById(simulationId: string) {
  return request<SimulationResponse>(`/api/v1/simulations/${simulationId}`);
}
