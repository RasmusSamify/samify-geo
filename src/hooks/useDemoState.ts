import { useSearchParams } from "react-router-dom";

export type Stage = 1 | 2 | 3;
export type Tab = "overview" | "samples" | "geology" | "history" | "report";

const VALID_TABS: Tab[] = ["overview", "samples", "geology", "history", "report"];

export const useDemoState = () => {
  const [params, setParams] = useSearchParams();

  const stageRaw = parseInt(params.get("stage") || "1", 10);
  const stage: Stage = ([1, 2, 3].includes(stageRaw) ? stageRaw : 1) as Stage;

  const tabRaw = params.get("tab") || "overview";
  const tab: Tab = (VALID_TABS.includes(tabRaw as Tab) ? tabRaw : "overview") as Tab;

  const speedRaw = parseFloat(params.get("speed") || "1");
  const speed: number = [1, 2, 4].includes(speedRaw) ? speedRaw : 1;

  const setStage = (next: Stage) => {
    const p = new URLSearchParams(params);
    p.set("stage", String(next));
    setParams(p, { replace: false });
  };

  const setTab = (next: Tab) => {
    const p = new URLSearchParams(params);
    p.set("tab", next);
    setParams(p, { replace: true });
  };

  const setSpeed = (next: number) => {
    const p = new URLSearchParams(params);
    if (next === 1) p.delete("speed");
    else p.set("speed", String(next));
    setParams(p, { replace: true });
  };

  return { stage, setStage, tab, setTab, speed, setSpeed };
};
