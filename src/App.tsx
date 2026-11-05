import { ErrorBoundary, LocationProvider } from "preact-iso";
import { AppNavigation } from "./components/AppNavigation";
import { AppRouter } from "./router";

export function App() {
  return (
    <LocationProvider>
      <a class="skip-link" href="#main-content">
        跳到内容
      </a>
      <header class="app-header">
        <a class="app-name" href="/">
          DMZ Tools
        </a>
        <AppNavigation />
      </header>
      <main id="main-content" class="app-content" tabIndex={-1}>
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </main>
    </LocationProvider>
  );
}
