import type { Simulation, StudentProfileInput } from "./types";

const SIM_PREFIX = "daedalus_simulation_";
const CURRENT_SIM_KEY = "daedalus_current_simulation_id";
const PENDING_PROFILE_KEY = "daedalus_pending_profile";
const RECENT_VIEWS_KEY = "daedalus_recent_views";
const BOOKMARKS_KEY = "daedalus_bookmarks";

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
  addToRecentViews(simulation.simulation_id, simulation.student_summary.name);
}

export function getSimulation(simulationId?: string): Simulation | null {
  if (typeof window === "undefined") return null;
  const id = simulationId || localStorage.getItem(CURRENT_SIM_KEY);
  if (!id) return null;
  const raw = localStorage.getItem(`${SIM_PREFIX}${id}`);
  if (!raw) return null;
  try {
    const sim = JSON.parse(raw) as Simulation;
    if (simulationId) {
      addToRecentViews(sim.simulation_id, sim.student_summary.name);
    }
    return sim;
  } catch {
    return null;
  }
}

function addToRecentViews(id: string, name: string) {
  if (typeof window === "undefined") return;
  const recent = getRecentViews();
  const filtered = recent.filter(item => item.id !== id);
  const updated = [{ id, name, timestamp: Date.now() }, ...filtered].slice(0, 5);
  localStorage.setItem(RECENT_VIEWS_KEY, JSON.stringify(updated));
}

export function getRecentViews(): Array<{ id: string, name: string, timestamp: number }> {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(RECENT_VIEWS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function toggleBookmark(id: string, name: string) {
  if (typeof window === "undefined") return;
  const bookmarks = getBookmarks();
  const exists = bookmarks.find(b => b.id === id);
  let updated;
  if (exists) {
    updated = bookmarks.filter(b => b.id !== id);
  } else {
    updated = [...bookmarks, { id, name }];
  }
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
  return !exists;
}

export function getBookmarks(): Array<{ id: string, name: string }> {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(BOOKMARKS_KEY);
  return raw ? JSON.parse(raw) : [];
}
