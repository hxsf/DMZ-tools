import { useEffect, useState } from "preact/hooks";
import { Trans, useTranslation } from "react-i18next";
import { calculateMaterials } from "../calculations/materials";
import { Drawer } from "../components/Drawer";
import { Icon } from "../components/Icon";
import { PrinterSummary } from "../components/PrinterSummary";
import { RecipeCatalog } from "../components/RecipeCatalog";
import { useApp } from "../context";
import { recipes } from "../data/recipes";
import { appPath } from "../paths";
import type { PrintDraft } from "../types/calculation";
import type { RecipeId } from "../types/recipe";
import type { RequirementTarget } from "../types/requirement";
import "../styles/printer.css";

const mobileQuery = "(max-width: 720px)";
function parseCount(raw: string): number {
  return /^\d+$/.test(raw.trim()) ? Number(raw) : Number.NaN;
}

export default function PrinterView() {
  const { t } = useTranslation();
  const { stores, persist, saveStatus } = useApp();
  const [drafts, setDrafts] = useState<readonly PrintDraft[]>([]);
  const [deduct, setDeduct] = useState(true);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobile, setMobile] = useState(() => window.matchMedia(mobileQuery).matches);
  useEffect(() => {
    const media = window.matchMedia(mobileQuery);
    function updateLayout() {
      setMobile(media.matches);
      if (!media.matches) setDrawerOpen(false);
    }
    media.addEventListener("change", updateLayout);
    return () => media.removeEventListener("change", updateLayout);
  }, []);
  const quantities = new Map(drafts.map((draft) => [draft.recipeId, draft.quantity]));
  const targets: readonly RequirementTarget[] = drafts.map((draft) => ({
    kind: "craft",
    recipeId: draft.recipeId,
    quantity: parseCount(draft.quantity),
    ...(draft.outputPerCraft.trim() === ""
      ? {}
      : { outputPerCraft: parseCount(draft.outputPerCraft) }),
  }));
  const calculation = calculateMaterials(targets, recipes, stores.inventory.state.value);

  function setQuantity(recipeId: RecipeId, quantity: string) {
    if (adding) return;
    setAdded(false);
    setDrafts((current) => {
      if (parseCount(quantity) === 0) return current.filter((draft) => draft.recipeId !== recipeId);
      if (current.some((draft) => draft.recipeId === recipeId)) {
        return current.map((draft) =>
          draft.recipeId === recipeId ? { ...draft, quantity } : draft,
        );
      }
      return [...current, { recipeId, quantity, outputPerCraft: "" }];
    });
  }
  function setOutput(recipeId: RecipeId, outputPerCraft: string) {
    setAdded(false);
    setDrafts((current) =>
      current.map((draft) => (draft.recipeId === recipeId ? { ...draft, outputPerCraft } : draft)),
    );
  }
  async function addRequirements() {
    if (adding || targets.length === 0 || calculation.isErr()) return;
    setAdding(true);
    setAdded(false);
    stores.plans.upsert({
      id: `plan:${crypto.randomUUID()}`,
      title: t("printer.planName", { count: stores.plans.state.value.length + 1 }),
      status: "active",
      priority: 0,
      targets,
    });
    await persist();
    setDrafts([]);
    setAdding(false);
    setDrawerOpen(false);
    setAdded(saveStatus.value === "saved");
  }
  const summary = (
    <PrinterSummary
      drafts={drafts}
      calculation={calculation}
      deduct={deduct}
      adding={adding}
      onQuantityChange={setQuantity}
      onOutputChange={setOutput}
      onDeductChange={setDeduct}
      onSubmit={() => void addRequirements()}
    />
  );

  return (
    <div class="printer-page">
      {added && (
        <div class="notice success" role="status">
          <Trans t={t} i18nKey="printer.added" />
          <a class="text-action" href={appPath("/requirements")}>
            <Trans t={t} i18nKey="printer.openRequirements" />
          </a>
        </div>
      )}
      <div class="calculator-layout">
        <RecipeCatalog quantities={quantities} disabled={adding} onQuantityChange={setQuantity} />
        {mobile ? (
          <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title={t("printer.review")}
          >
            {saveStatus.value === "error" && (
              <div class="notice error" role="alert">
                <Trans t={t} i18nKey="app.saveFailed" />
                <button type="button" onClick={() => void persist()}>
                  <Trans t={t} i18nKey="app.retry" />
                </button>
              </div>
            )}
            {summary}
          </Drawer>
        ) : (
          <aside class="printer-review" aria-label={t("printer.review")}>
            {summary}
          </aside>
        )}
      </div>
      {mobile && (
        <div class="printer-selection-bar">
          <span role="status" aria-live="polite">
            <Trans t={t} i18nKey="printer.selected" count={drafts.length} />
          </span>
          <button
            type="button"
            class="primary-button"
            aria-haspopup="dialog"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
          >
            <Icon name="checklist" />
            <Trans t={t} i18nKey="printer.viewSelection" />
          </button>
        </div>
      )}
    </div>
  );
}
