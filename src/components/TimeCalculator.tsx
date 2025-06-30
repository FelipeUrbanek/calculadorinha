import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, RotateCcw, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import TimeRow from "./TimeRow";
import TimeResults from "./TimeResults";
import DecimalConverter from "./DecimalConverter";

export interface TimeEntry {
  id: string;
  hours: number;
  minutes: number;
  operation: "add" | "subtract";
}

// Chaves para o localStorage
const STORAGE_KEYS = {
  TIME_ENTRIES: "hora-certa-entries",
  SHOW_DECIMAL: "hora-certa-show-decimal",
};

const TimeCalculator = () => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => {
    // Recupera os dados do localStorage na inicialização
    const savedEntries = localStorage.getItem(STORAGE_KEYS.TIME_ENTRIES);
    return savedEntries
      ? JSON.parse(savedEntries)
      : [{ id: "1", hours: 0, minutes: 0, operation: "add" }];
  });

  const [showDecimal, setShowDecimal] = useState<boolean>(() => {
    // Recupera a preferência de exibição decimal
    const savedPreference = localStorage.getItem(STORAGE_KEYS.SHOW_DECIMAL);
    return savedPreference ? JSON.parse(savedPreference) : false;
  });

  const { toast } = useToast();
  const timeRowRefs = useRef<{ [key: string]: HTMLDivElement }>({});
  const hoursInputRefs = useRef<{ [key: string]: HTMLInputElement }>({});

  // Salva as entradas no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.TIME_ENTRIES,
      JSON.stringify(timeEntries)
    );
  }, [timeEntries]);

  // Salva a preferência de exibição decimal
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.SHOW_DECIMAL,
      JSON.stringify(showDecimal)
    );
  }, [showDecimal]);

  const addTimeEntry = () => {
    const newId = Date.now().toString();
    setTimeEntries([
      ...timeEntries,
      { id: newId, hours: 0, minutes: 0, operation: "add" },
    ]);

    // Foca no input de horas da nova linha após ela ser criada
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

  const resetAll = () => {
    setTimeEntries([{ id: "1", hours: 0, minutes: 0, operation: "add" }]);
    toast({
      title: "Reset realizado",
      description: "Todos os valores foram zerados.",
      duration: 1000, // 1 segundo
    });
  };

  const calculateTotalMinutes = (entries: TimeEntry[]): number => {
    return entries.reduce((total, entry) => {
      const entryMinutes = entry.hours * 60 + entry.minutes;
      return entry.operation === "add"
        ? total + entryMinutes
        : total - entryMinutes;
    }, 0);
  };

  const getAdditionEntries = () =>
    timeEntries.filter((entry) => entry.operation === "add");
  const getSubtractionEntries = () =>
    timeEntries.filter((entry) => entry.operation === "subtract");

  const minutesToTime = (totalMinutes: number) => {
    const isNegative = totalMinutes < 0;
    const absMinutes = Math.abs(totalMinutes);
    const hours = Math.floor(absMinutes / 60);
    const minutes = absMinutes % 60;
    return { hours, minutes, isNegative };
  };

  const minutesToDecimal = (totalMinutes: number): number => {
    return totalMinutes / 60;
  };

  const totalMinutes = calculateTotalMinutes(timeEntries);
  const additionTotal = getAdditionEntries().reduce(
    (total, entry) => total + entry.hours * 60 + entry.minutes,
    0
  );
  const subtractionTotal = getSubtractionEntries().reduce(
    (total, entry) => total + entry.hours * 60 + entry.minutes,
    0
  );

  const finalResult = minutesToTime(totalMinutes);
  const additionResult = minutesToTime(additionTotal);
  const subtractionResult = minutesToTime(subtractionTotal);

  const handleFocusNextRow = (currentIndex: number) => {
    const nextEntry = timeEntries[currentIndex + 1];
    if (nextEntry) {
      const nextInput = hoursInputRefs.current[nextEntry.id];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const registerHoursInputRef = (id: string, ref: HTMLInputElement | null) => {
    if (ref) {
      hoursInputRefs.current[id] = ref;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 px-2 sm:px-0">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl sm:text-2xl text-slate-800">
              Calculadorinha - Calcule suas horas facilmente
            </CardTitle>
            <motion.div
              className="flex items-center justify-center gap-2 mt-2"
              whileHover={{ scale: 1.02 }}
            >
              <Switch
                id="show-decimal"
                checked={showDecimal}
                onCheckedChange={setShowDecimal}
              />
              <Label htmlFor="show-decimal" className="text-sm text-slate-600">
                Mostrar conversão decimal
              </Label>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Headers */}
            <div className="hidden sm:grid grid-cols-12 gap-2 sm:gap-4 items-center text-sm font-medium text-slate-600 px-2 sm:px-4">
              <div className="col-span-4 sm:col-span-2">Operação</div>
              <div className="col-span-4 sm:col-span-2">Horas</div>
              <div className="col-span-4 sm:col-span-2">Minutos</div>
              {showDecimal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-6 sm:col-span-3"
                >
                  Decimal
                </motion.div>
              )}
              <div
                className={`${
                  showDecimal
                    ? "col-span-6 sm:col-span-3"
                    : "col-span-12 sm:col-span-6"
                }`}
              >
                Ações
              </div>
            </div>

            {/* Time Entries */}
            <AnimatePresence>
              <div className="space-y-2">
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
                      onFocusNextRow={handleFocusNextRow}
                      onRegisterHoursInput={(ref) =>
                        registerHoursInputRef(entry.id, ref)
                      }
                    />
                  </div>
                ))}
              </div>
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex justify-center gap-2 pt-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={addTimeEntry}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Linha
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={resetAll} variant="outline">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Results Section */}
      <TimeResults
        finalResult={finalResult}
        additionResult={additionResult}
        subtractionResult={subtractionResult}
        showDecimal={showDecimal}
        finalDecimal={minutesToDecimal(totalMinutes)}
        additionDecimal={minutesToDecimal(additionTotal)}
        subtractionDecimal={minutesToDecimal(subtractionTotal)}
      />

      {/* Decimal Converter */}
      <DecimalConverter />
    </div>
  );
};

export default TimeCalculator;
