// Browser-memory coordination only; this does not control response Set-Cookie.
let state = { generation: 0, phase: "active" as "active" | "login" | "expired" };
const initialState = state;
const listeners = new Set<() => void>();
export const getClientSession = () => state;
export const getServerSessionSnapshot = () => initialState;
export function subscribeClientSession(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
function publish(next: typeof state) {
  state = next;
  listeners.forEach((listener) => listener());
}
export function beginClientLogin() {
  const generation = state.generation + 1;
  publish({ generation, phase: "login" });
  return generation;
}
export function finishClientLogin(generation: number) {
  if (state.generation === generation) publish({ generation, phase: "active" });
}
export function expireClientSession(generation: number) {
  if (state.generation !== generation || state.phase !== "active") return false;
  publish({ generation, phase: "expired" });
  return true;
}
