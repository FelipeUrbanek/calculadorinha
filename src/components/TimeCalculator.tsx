import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence } from "framer-motion";
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
      const removedIndex = timeEntries.findIndex((entry) => entry.id === id);
      setTimeEntries(timeEntries.filter((entry) => entry.id !== id));

      setTimeout(() => {
        if (containerRef.current && removedIndex > 0) {
          const previousRow =
            timeRowRefs.current[timeEntries[removedIndex - 1]?.id];
          if (previousRow) {
            previousRow.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }
      }, 100);
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
  };

  return (
    <Card className="shadow-sm border-0 bg-white h-full">
      <CardHeader className="pb-4">
        <div
          className={`hidden sm:grid ${
            showDecimal
              ? "sm:grid-cols-[140px_1fr_1fr_1fr_40px]"
              : "sm:grid-cols-[140px_1fr_1fr_40px]"
          } gap-4 px-4 mb-2 text-xs font-medium text-slate-500`}
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
              Adicionar nova linha
            </Button>
            <Button
              onClick={clearAllEntries}
              variant="outline"
              className="h-12 px-4 border-2 border-slate-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all hover:scale-105 active:scale-95"
            >
              Limpar
            </Button>
          </div>
          <div className="bg-slate-100 text-slate-600 text-xs px-4 py-2 rounded-full font-medium animate-pulse">
            Total de linhas: {timeEntries.length}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeCalculator;
