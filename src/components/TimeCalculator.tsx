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

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <Card className="h-full rounded-[26px] border-0 bg-card shadow-none">
      <CardHeader className="pb-3">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Lançamentos de hoje
        </h2>
        <p className="text-sm text-muted-foreground first-letter:uppercase">
          {today}
        </p>
      </CardHeader>
      <CardContent className="pb-0">
        <div ref={containerRef} className="space-y-2.5">
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

        {/* Ações: ficam abaixo das linhas, sem cobrir nada */}
        <div className="mt-3 pb-6 flex flex-wrap items-center gap-2">
          <Button
            onClick={addTimeEntry}
            className="h-12 rounded-full px-6 text-[15px] font-bold bg-theme-base text-white hover:bg-theme-base/90 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5 mr-1.5 stroke-[2.75]" />
            Adicionar linha
          </Button>
          <Button
            onClick={clearAllEntries}
            variant="ghost"
            className="h-12 rounded-full px-5 text-[15px] font-bold text-muted-foreground hover:text-bad hover:bg-bad-soft transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-1.5 stroke-[2.5]" />
            Limpar tudo
          </Button>
          <span className="ml-auto text-sm text-muted-foreground">
            {timeEntries.length} {timeEntries.length === 1 ? "linha" : "linhas"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeCalculator;
