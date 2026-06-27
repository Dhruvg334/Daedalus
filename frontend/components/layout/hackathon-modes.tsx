export { PresentationToolsProvider, usePresentationTools } from "./presentation-tools";

/**
 * Backwards-compatible dashboard hook.
 *
 * Older dashboard code still imports useHackathon() for presentation-mode state.
 * The public product language has moved away from that terminology, but keeping
 * this shim avoids a risky route-wide refactor this late in release.
 */
export function useHackathon() {
  return {
    presentationMode: false,
    judgeMode: false,
    isHackathonMode: false,
    mode: "product",
    setMode: () => {},
    togglePresentation: () => {},
    toggleJudge: () => {},
  };
}
