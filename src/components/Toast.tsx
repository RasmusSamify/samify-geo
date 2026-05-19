import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

type ToastKind = "info" | "success" | "demo";

type ToastItem = {
  id: number;
  message: string;
  detail?: string;
  kind: ToastKind;
};

type ToastContextValue = {
  toast: (message: string, opts?: { detail?: string; kind?: ToastKind }) => void;
  demo: (action: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback<ToastContextValue["toast"]>((message, opts) => {
    const id = Date.now() + Math.random();
    const item: ToastItem = {
      id,
      message,
      detail: opts?.detail,
      kind: opts?.kind ?? "info",
    };
    setItems((prev) => [...prev, item]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const demo = useCallback<ToastContextValue["demo"]>(
    (action) => {
      toast(action, {
        detail: "Funktion tillgänglig i nästa iteration.",
        kind: "demo",
      });
    },
    [toast],
  );

  return (
    <ToastContext.Provider value={{ toast, demo }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[1100] flex flex-col gap-2 pointer-events-none">
        {items.map((item) => (
          <div
            key={item.id}
            className="pointer-events-auto bg-ink text-white rounded shadow-lg px-3.5 py-2.5 flex items-start gap-2.5 min-w-[280px] max-w-[420px] fade-up"
          >
            <div
              className={`mt-0.5 ${
                item.kind === "success"
                  ? "text-green-400"
                  : item.kind === "demo"
                    ? "text-amber-300"
                    : "text-sky-300"
              }`}
            >
              <Icon
                name={
                  item.kind === "success"
                    ? "check"
                    : item.kind === "demo"
                      ? "info"
                      : "info"
                }
                size={14}
                strokeWidth={2}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-medium leading-snug">
                {item.message}
              </div>
              {item.detail && (
                <div className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  {item.detail}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
