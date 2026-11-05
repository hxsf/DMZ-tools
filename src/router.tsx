import { lazy, Route, Router } from "preact-iso";
import { appPath } from "./paths";

const RecipesView = lazy(() => import("./views/RecipesView"));
const WeaponManualsView = lazy(() => import("./views/WeaponManualsView"));
const PrinterView = lazy(() => import("./views/PrinterView"));
const RequirementsView = lazy(() => import("./views/RequirementsView"));
const NotFoundView = lazy(() => import("./views/NotFoundView"));

export function AppRouter() {
  return (
    <Router>
      <Route path={appPath("/")} component={RecipesView} />
      <Route path={appPath("/recipes")} component={RecipesView} />
      <Route path={appPath("/weapon-manuals")} component={WeaponManualsView} />
      <Route path={appPath("/printer")} component={PrinterView} />
      <Route path={appPath("/requirements")} component={RequirementsView} />
      <Route default component={NotFoundView} />
    </Router>
  );
}
