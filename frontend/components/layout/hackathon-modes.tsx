export { PresentationToolsProvider, usePresentationTools } from "./presentation-tools";
export function useHackathon() {
  return {
    isHackathonMode: false,
    mode: "product",
    setMode: () => {},
  };
}