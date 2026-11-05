import { lazy, Route, Router } from "preact-iso";

const RecipesView = lazy(() => import("./views/RecipesView"));
const WeaponManualsView = lazy(() => import("./views/WeaponManualsView"));
const PrinterView = lazy(() => import("./views/PrinterView"));
const RequirementsView = lazy(() => import("./views/RequirementsView"));
const NotFoundView = lazy(() => import("./views/NotFoundView"));

export function AppRouter() {
  return (
    <Router>
      <Route path="/" component={RecipesView} />
      <Route path="/recipes" component={RecipesView} />
      <Route path="/weapon-manuals" component={WeaponManualsView} />
      <Route path="/printer" component={PrinterView} />
      <Route path="/requirements" component={RequirementsView} />
      <Route default component={NotFoundView} />
    </Router>
  );
}
