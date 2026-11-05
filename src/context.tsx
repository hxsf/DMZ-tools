import { createContext, type ComponentChildren } from "preact";
import { useContext } from "preact/hooks";
import { None, Some, type Option } from "ts-results-es";
import type { createAppState } from "./stores/app";

type AppState = ReturnType<typeof createAppState>;
const Context = createContext<Option<AppState>>(None);

export function AppProvider({ state, children }: { state: AppState; children: ComponentChildren }) {
  return <Context.Provider value={Some(state)}>{children}</Context.Provider>;
}

export function useApp(): AppState {
  const state = useContext(Context);
  if (state.isNone()) throw new Error("AppProvider is required.");
  return state.value;
}
