import type {
  DemoPersona,
  SimulationRequest,
  SimulationResponse,
  AssistantMessage,
  AssistantChatResponse,
  OpportunityResponse,
  LearningHubResponse
} from "./types";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_DAEDALUS_API_URL ||
  "http://localhost:8000"
).replace(/\/$/, "");

const DEFAULT_TIMEOUT_MS = 45000;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

async function request<T>(
  path: string,
  init?: RequestInit,
  options?: { timeoutMs?: number; retries?: number }
): Promise<T> {
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const retries = options?.retries ?? 0;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(init?.headers || {}),
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(formatApiError(data, "Daedalus request failed. Please try again."));
      }

      return data as T;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        lastError = new Error("Daedalus is taking longer than expected to respond. Please retry in a few seconds.");
      } else if (error instanceof TypeError) {
        lastError = new Error("Daedalus is starting up or temporarily unreachable. Please retry once the backend service is awake.");
      } else {
        lastError = error instanceof Error ? error : new Error("Daedalus request failed. Please try again.");
      }

      if (attempt < retries) {
        await sleep(900 * (attempt + 1));
        continue;
      }
    } finally {
      window.clearTimeout(timeout);
    }
  }

  throw lastError ?? new Error("Daedalus request failed. Please try again.");
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function getHealth() {
  return request<{ success: boolean; status: string; service: string; version: string }>("/api/v1/health", undefined, { timeoutMs: 15000, retries: 1 });
}

export function getDemoPersonas() {
  return request<{ success: true; personas: DemoPersona[] }>("/api/v1/demo-personas", undefined, { timeoutMs: 30000, retries: 1 });
}

export function simulateCareerPaths(payload: SimulationRequest) {
  return request<SimulationResponse>("/api/v1/simulate", {
    method: "POST",
    body: JSON.stringify(payload),
  }, { timeoutMs: 60000, retries: 1 });
}

export function getSimulationById(simulation_id: string) {
  return request<SimulationResponse>(`/api/v1/simulations/${simulation_id}`, undefined, { timeoutMs: 30000, retries: 1 });
}

export function submitFeedback(simulation_id: string, rating: number) {
  return request<{ success: true }>("/api/v1/feedback", {
    method: "POST",
    body: JSON.stringify({ simulation_id, rating }),
  });
}

export function chatWithAssistant(messages: AssistantMessage[], simulation_id?: string) {
  return request<AssistantChatResponse>("/api/v1/assistant/chat", {
    method: "POST",
    body: JSON.stringify({ messages, simulation_id }),
  }, { timeoutMs: 45000, retries: 1 });
}

export function getOpportunities(career_id: string, simulation_id: string) {
  return request<OpportunityResponse>("/api/v1/hubs/opportunities", {
    method: "POST",
    body: JSON.stringify({ career_id, simulation_id }),
  }, { timeoutMs: 30000, retries: 1 });
}

export function getLearningPath(career_id: string) {
  return request<LearningHubResponse>(`/api/v1/hubs/learning-path/${career_id}`, undefined, { timeoutMs: 30000, retries: 1 });
}

export function runAutomation(type: string, simulation_id: string, instructions?: string, context_overrides?: Partial<Simulation>) {
  return request<{ content: string }>("/api/v1/assistant/automate", {
    method: "POST",
    body: JSON.stringify({
      automation_type: type,
      simulation_id,
      additional_instructions: instructions,
      context_overrides
    }),
  }, { timeoutMs: 45000, retries: 1 });
}

export function getProgress(simulation_id: string) {
  return request<any>(`/api/v1/progress/${simulation_id}`, undefined, { timeoutMs: 30000, retries: 1 });
}

export function updateProgress(payload: {
  simulation_id: string,
  resource_id?: string,
  task_id?: string,
  skill?: string,
  hours?: number
}) {
  return request<any>("/api/v1/progress/update", {
    method: "POST",
    body: JSON.stringify(payload),
  }, { timeoutMs: 30000, retries: 1 });
}
