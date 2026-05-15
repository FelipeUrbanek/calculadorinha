import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import StandardCalculator from "./StandardCalculator";
import { Button } from "./ui/button";
import { Plus, Calculator, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface CalcInstance {
  id: number;
  name: string;
}

const ConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      ></div>
      <div className="relative bg-background border border-border rounded-[2rem] p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 ring-1 ring-black/5 dark:ring-white/5">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-theme-base/10 flex items-center justify-center text-theme-base mb-2">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-foreground uppercase tracking-tight">
            Reiniciar Workspace?
          </h2>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            Isso removerá todas as calculadoras e limpará permanentemente o
            histórico de cálculos.
          </p>
          <div className="flex gap-3 w-full mt-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl bg-secondary text-secondary-foreground font-bold hover:opacity-80 transition-all active:scale-95"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 py-4 rounded-2xl bg-theme-base text-primary-foreground font-bold hover:opacity-90 shadow-lg shadow-theme-base/20 transition-all active:scale-95"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PiPWorkspace: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [calculators, setCalculators] = useState<CalcInstance[]>(() => {
    const saved = localStorage.getItem("pip-calculators-list");
    return saved ? JSON.parse(saved) : [{ id: Date.now(), name: "CALC 1" }];
  });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Sync theme classes to the PiP window's root element
  useEffect(() => {
    const syncTheme = () => {
      if (!containerRef.current) return;

      const pipDoc = containerRef.current.ownerDocument;
      const pipRoot = pipDoc.documentElement;
      const mainRoot = document.documentElement;

      if (mainRoot && pipRoot) {
        const mainClassList = mainRoot.classList.value;
        if (pipRoot.className !== mainClassList) {
          pipRoot.className = mainClassList;
          pipDoc.body.className = mainClassList;
        }
      }
    };

    syncTheme();
    const interval = setInterval(syncTheme, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem("pip-calculators-list", JSON.stringify(calculators));
  }, [calculators]);

  const addCalculator = () => {
    setCalculators((prev) => {
      const newId = Date.now();
      return [...prev, { id: newId, name: `CALC ${prev.length + 1}` }];
    });
  };

  const handleClearAll = () => {
    calculators.forEach((calc) => {
      localStorage.removeItem(`calc-value-${calc.id}`);
      localStorage.removeItem(`calc-title-${calc.id}`);
      localStorage.removeItem(`calc-history-${calc.id}`);
    });
    setCalculators([{ id: Date.now(), name: "CALC 1" }]);
    toast.success("Workspace reiniciado.");
  };

  const removeCalculator = (id: number) => {
    localStorage.removeItem(`calc-value-${id}`);
    localStorage.removeItem(`calc-history-${id}`);
    setCalculators((prev) => prev.filter((c) => c.id !== id));
  };

  useEffect(() => {
    const handleAdd = () => addCalculator();
    window.addEventListener("add-pip-calc", handleAdd);
    return () => window.removeEventListener("add-pip-calc", handleAdd);
  }, [calculators.length]);

  return (
    <div
      ref={containerRef}
      className="relative h-screen flex flex-col bg-transparent group/workspace overflow-hidden font-sans"
    >
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleClearAll}
      />

      <div className="flex justify-end items-center gap-2 px-6 py-4 sticky top-0 z-[200] opacity-0 group-hover/workspace:opacity-100 transition-all">
        <button
          onClick={() => setIsConfirmOpen(true)}
          className="w-8 h-8 rounded-full bg-destructive/10 hover:bg-destructive text-destructive hover:text-destructive-foreground flex items-center justify-center transition-all border border-destructive/20"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <button
          onClick={addCalculator}
          className="w-10 h-10 rounded-full bg-theme-base text-primary-foreground flex items-center justify-center transition-all shadow-lg hover:scale-110 active:scale-95"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>
      </div>

      <div className="flex-1 px-6 pb-20 overflow-y-auto scroll-smooth custom-pip-scrollbar">
        <div
          className="grid gap-6 items-start justify-start w-full"
          style={{
            gridTemplateColumns:
              calculators.length === 1
                ? "1fr"
                : `repeat(auto-fill, minmax(320px, 1fr))`,
          }}
        >
          {calculators.map((calc) => (
            <div
              key={calc.id}
              className="animate-in fade-in zoom-in-95 duration-500 w-full"
            >
              <div className="rounded-[2rem] overflow-hidden border border-border shadow-2xl bg-background/40 backdrop-blur-3xl ring-1 ring-border/5 hover:border-theme-base/30 transition-all">
                <StandardCalculator
                  id={calc.id}
                  onClose={() => removeCalculator(calc.id)}
                  title={calc.name}
                  onTitleChange={(newName: string) => {
                    setCalculators((prev) =>
                      prev.map((c) =>
                        c.id === calc.id ? { ...c, name: newName } : c,
                      ),
                    );
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        body { 
          margin: 0; 
          padding: 0; 
          overflow: hidden !important; 
          background-color: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
        }
        html {
          background-color: hsl(var(--background)) !important;
          color-scheme: dark light;
        }
        .custom-pip-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-pip-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-pip-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(var(--theme-base-rgb), 0.2); 
          border-radius: 20px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        .custom-pip-scrollbar::-webkit-scrollbar-thumb:hover { 
          background: rgba(var(--theme-base-rgb), 0.5); 
        }
      `}</style>
    </div>
  );
};

const PiPCalculator: React.FC = () => {
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    setIsSupported("documentPictureInPicture" in window);
  }, []);

  if (!isSupported) return null;

  const openPiP = async () => {
    if ((window as any).documentPictureInPicture.window) {
      window.dispatchEvent(new CustomEvent("add-pip-calc"));
      return;
    }

    try {
      const pipWindow = await (
        window as any
      ).documentPictureInPicture.requestWindow({
        width: 700,
        height: 600,
      });

      [...document.styleSheets].forEach((styleSheet) => {
        try {
          if (styleSheet.cssRules) {
            const newStyle = pipWindow.document.createElement("style");
            [...styleSheet.cssRules].forEach((rule) => {
              newStyle.appendChild(
                pipWindow.document.createTextNode(rule.cssText),
              );
            });
            pipWindow.document.head.appendChild(newStyle);
          } else if (styleSheet.href) {
            const newLink = pipWindow.document.createElement("link");
            newLink.rel = "stylesheet";
            newLink.href = styleSheet.href;
            pipWindow.document.head.appendChild(newLink);
          }
        } catch (e) {}
      });

      const container = pipWindow.document.createElement("div");
      container.id = "pip-root";
      pipWindow.document.body.appendChild(container);
      pipWindow.document.title = "Multitools PiP";

      const root = createRoot(container);
      root.render(<PiPWorkspace />);

      pipWindow.addEventListener("pagehide", () => {
        root.unmount();
      });
    } catch (error) {
      console.error("Failed to open PiP window:", error);
      toast.error("Erro ao abrir janela PiP.");
    }
  };

  return (
    <Button
      onClick={openPiP}
      className="h-16 w-16 rounded-full bg-background border-2 border-theme-base hover:bg-accent text-foreground shadow-[0_0_30px_rgba(var(--theme-base-rgb),0.3)] flex flex-col items-center justify-center transition-all hover:scale-110 active:scale-95 group relative cursor-pointer"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-theme-gradient-start/20 to-theme-gradient-end/20 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
      <Calculator className="h-7 w-7 relative z-10 text-theme-base drop-shadow-[0_0_8px_rgba(var(--theme-base-rgb),0.4)] group-hover:rotate-12 transition-transform" />
      <span className="text-[8px] font-black uppercase tracking-tighter relative z-10 mt-1 text-theme-base">
        PiP Mode
      </span>
    </Button>
  );
};

export default PiPCalculator;
