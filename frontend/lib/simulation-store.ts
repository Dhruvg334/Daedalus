import type { Simulation, StudentProfileInput } from "./types";

const SIM_PREFIX = "daedalus_simulation_";
const CURRENT_SIM_KEY = "daedalus_current_simulation_id";
const PENDING_PROFILE_KEY = "daedalus_pending_profile";

export function savePendingProfile(profile: StudentProfileInput) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PENDING_PROFILE_KEY, JSON.stringify(profile));
}

export function getPendingProfile(): StudentProfileInput | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PENDING_PROFILE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StudentProfileInput;
  } catch {
    return null;
  }
}

export function clearPendingProfile() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PENDING_PROFILE_KEY);
}

export function saveSimulation(simulation: Simulation) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${SIM_PREFIX}${simulation.simulation_id}`, JSON.stringify(simulation));
  localStorage.setItem(CURRENT_SIM_KEY, simulation.simulation_id);
}

export function getSimulation(simulationId?: string): Simulation | null {
  if (typeof window === "undefined") return null;
  const id = simulationId || localStorage.getItem(CURRENT_SIM_KEY);
  if (!id) return null;
  const raw = localStorage.getItem(`${SIM_PREFIX}${id}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Simulation;
  } catch {
    return null;
  }
}
