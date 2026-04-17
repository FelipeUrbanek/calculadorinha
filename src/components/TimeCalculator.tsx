import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import TimeRow from "./TimeRow";

export interface TimeEntry {
  id: string;
  hours: number;
  minutes: number;
  operation: "add" | "subtract";
}

interface TimeCalculatorProps {
  timeEntries: TimeEntry[];
  setTimeEntries: (entries: TimeEntry[]) => void;
  showDecimal: boolean;
}

const TimeCalculator = ({
  timeEntries,
  setTimeEntries,
  showDecimal,
}: TimeCalculatorProps) => {
  const timeRowRefs = useRef<{ [key: string]: HTMLDivElement }>({});
  const hoursInputRefs = useRef<{ [key: string]: HTMLInputElement }>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const addTimeEntry = () => {
    const newId = Date.now().toString();
    setTimeEntries([
      ...timeEntries,
      { id: newId, hours: 0, minutes: 0, operation: "add" },
    ]);

    setTimeout(() => {
      const newInput = hoursInputRefs.current[newId];
      if (newInput) {
        newInput.focus();
      }
    }, 0);
  };

  const removeTimeEntry = (id: string) => {
    if (timeEntries.length > 1) {
      setTimeEntries(timeEntries.filter((entry) => entry.id !== id));
    }
  };

  const updateTimeEntry = (
    id: string,
    hours: number,
    minutes: number,
    operation: "add" | "subtract"
  ) => {
    setTimeEntries(
      timeEntries.map((entry) =>
        entry.id === id ? { ...entry, hours, minutes, operation } : entry
      )
    );
  };

  const registerHoursInputRef = (id: string, ref: HTMLInputElement | null) => {
    if (ref) {
      hoursInputRefs.current[id] = ref;
    }
  };

  const clearAllEntries = () => {
    setTimeEntries([{ id: "1", hours: 0, minutes: 0, operation: "add" }]);
    setTimeout(() => {
      const page = document.getElementById("page-scroll");
      if (page) {
        page.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <Card className="shadow-xl shadow-theme-base/5 border-white/40 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl h-full transition-all duration-500 hover:shadow-2xl hover:shadow-theme-base/10">
      <CardHeader className="pb-4">
        <div
          className={`hidden sm:grid ${
            showDecimal
              ? "sm:grid-cols-[140px_1fr_1fr_1fr_40px]"
              : "sm:grid-cols-[140px_1fr_1fr_40px]"
          } gap-4 px-4 mb-2 text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors`}
        >
          <div>Operação</div>
          <div>Horas</div>
          <div>Minutos</div>
          {showDecimal && <div>Decimal</div>}
          <div className="text-center">Ações</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div ref={containerRef} className="space-y-4">
          <AnimatePresence>
            {timeEntries.map((entry, index) => (
              <div
                key={entry.id}
                ref={(el) => {
                  if (el) {
                    timeRowRefs.current[entry.id] = el;
                  }
                }}
              >
                <TimeRow
                  entry={entry}
                  index={index}
                  totalRows={timeEntries.length}
                  onUpdate={updateTimeEntry}
                  onRemove={removeTimeEntry}
                  onAddNew={addTimeEntry}
                  canRemove={timeEntries.length > 1}
                  showDecimal={showDecimal}
                  onRegisterHoursInput={(ref) =>
                    registerHoursInputRef(entry.id, ref)
                  }
                />
              </div>
            ))}
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex gap-2 w-full sm:w-auto flex-1">
            <Button
              onClick={addTimeEntry}
              className="flex-1 sm:flex-initial bg-slate-600 hover:bg-slate-700 text-white h-12 text-base font-medium transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-5 h-5 mr-1 stroke-[2.5]" />
              Adicionar nova linha
            </Button>
            <Button
              onClick={clearAllEntries}
              variant="outline"
              className="h-12 px-4 border-2 border-slate-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all hover:scale-105 active:scale-95"
            >
              <Trash2 className="w-5 h-5 mr-1 stroke-[2.5]" />
              Limpar
            </Button>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-4 py-2 rounded-full font-medium animate-pulse transition-colors">
            Total de linhas: {timeEntries.length}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeCalculator;
