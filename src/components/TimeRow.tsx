import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { X, Plus, Minus } from "lucide-react";
import { TimeEntry } from "./TimeCalculator";

interface TimeRowProps {
  entry: TimeEntry;
  index: number;
  totalRows: number;
  onUpdate: (
    id: string,
    hours: number,
    minutes: number,
    operation: "add" | "subtract"
  ) => void;
  onRemove: (id: string) => void;
  onAddNew: () => void;
  canRemove: boolean;
  showDecimal: boolean;
  onRegisterHoursInput: (ref: HTMLInputElement | null) => void;
}

const TimeRow = ({
  entry,
  index,
  totalRows,
  onUpdate,
  onRemove,
  onAddNew,
  canRemove,
  showDecimal,
  onRegisterHoursInput,
}: TimeRowProps) => {
  const hoursInputRef = useRef<HTMLInputElement>(null);
  const minutesInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onRegisterHoursInput(hoursInputRef.current);
  }, [onRegisterHoursInput]);

  const handleHoursChange = (value: string) => {
    const hours = Math.max(0, parseInt(value) || 0);
    onUpdate(entry.id, hours, entry.minutes, entry.operation);
  };

  const handleMinutesChange = (value: string) => {
    const minutes = Math.max(0, Math.min(59, parseInt(value) || 0));
    onUpdate(entry.id, entry.hours, minutes, entry.operation);
  };

  const toggleOperation = (checked: boolean) => {
    const newOperation = checked ? "add" : "subtract";
    onUpdate(entry.id, entry.hours, entry.minutes, newOperation);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    inputType: "hours" | "minutes"
  ) => {
    if (e.key === "Enter" || (e.key === "Tab" && !e.shiftKey)) {
      e.preventDefault();

      const isLastRow = rowIndex === totalRows - 1;
      const isHoursInput = inputType === "hours";
      const isMinutesInput = inputType === "minutes";

      if (isHoursInput) {
        const minutesInput = document.querySelector(
          `input[data-input-type="minutes"][data-row-index="${rowIndex}"]`
        ) as HTMLInputElement;
        if (minutesInput) {
          minutesInput.focus();
        }
        return;
      }

      if (isMinutesInput) {
        if (isLastRow) {
          onAddNew();
          setTimeout(() => {
            const nextHoursInput = document.querySelector(
              `input[data-input-type="hours"][data-row-index="${rowIndex + 1}"]`
            ) as HTMLInputElement;
            if (nextHoursInput) {
              nextHoursInput.focus();
            }
          }, 0);
        } else {
          const nextHoursInput = document.querySelector(
            `input[data-input-type="hours"][data-row-index="${rowIndex + 1}"]`
          ) as HTMLInputElement;
          if (nextHoursInput) {
            nextHoursInput.focus();
          }
        }
      }
    }
  };

  const isAddition = entry.operation === "add";
  const decimalValue = (
    entry.hours +
    Math.ceil((entry.minutes / 60) * 100) / 100
  ).toFixed(2);

  const fieldClass =
    "flex items-center gap-1.5 h-[54px] px-3.5 rounded-2xl bg-card focus-within:ring-2 focus-within:ring-theme-base transition-shadow";
  const inputClass =
    "h-full w-full min-w-0 border-0 bg-transparent p-0 text-right text-2xl sm:text-[27px] md:text-[27px] font-semibold tabular-nums shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="relative grid grid-cols-[54px_1fr_1fr] sm:flex sm:flex-nowrap items-center gap-2.5 sm:gap-3 p-2.5 rounded-[20px] bg-background"
      data-row-index={index}
    >
      {/* Operation Toggle: a "marcação" redonda. Verde soma, vermelho subtrai. */}
      <button
        onClick={() => toggleOperation(!isAddition)}
        aria-label={
          isAddition
            ? "Somando. Clique para subtrair"
            : "Subtraindo. Clique para somar"
        }
        title={isAddition ? "Somar (clique para subtrair)" : "Subtrair (clique para somar)"}
        className={`h-[54px] w-[54px] shrink-0 rounded-full flex items-center justify-center text-white dark:text-background transition-transform active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-base focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          isAddition ? "bg-ok" : "bg-bad"
        }`}
      >
        {isAddition ? (
          <Plus className="h-7 w-7 stroke-[2.75]" />
        ) : (
          <Minus className="h-7 w-7 stroke-[2.75]" />
        )}
      </button>

      {/* Hours Input */}
      <div className="flex-1 min-w-0 sm:min-w-[100px]">
        <label className={fieldClass}>
          <Input
            ref={hoursInputRef}
            type="number"
            min="0"
            value={entry.hours.toString()}
            onChange={(e) => handleHoursChange(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index, "hours")}
            onFocus={(e) => e.target.select()}
            className={inputClass}
            placeholder="0"
            aria-label="Horas"
            data-input-type="hours"
            data-row-index={index}
          />
          <span className="text-xs sm:text-sm text-muted-foreground shrink-0">h</span>
        </label>
      </div>

      {/* Minutes Input */}
      <div className="flex-1 min-w-0 sm:min-w-[100px]">
        <label className={fieldClass}>
          <Input
            ref={minutesInputRef}
            type="number"
            min="0"
            max="59"
            value={entry.minutes.toString().padStart(2, "0")}
            onChange={(e) => handleMinutesChange(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index, "minutes")}
            onFocus={(e) => e.target.select()}
            className={inputClass}
            placeholder="00"
            aria-label="Minutos"
            data-input-type="minutes"
            data-row-index={index}
          />
          <span className="text-xs sm:text-sm text-muted-foreground shrink-0">min</span>
        </label>
      </div>

      {/* Decimal Display */}
      {showDecimal && (
        <div
          className="col-span-2 col-start-2 sm:col-auto sm:w-[84px] shrink-0 h-10 flex items-center justify-center rounded-xl bg-warn-soft text-warn-ink text-[15px] font-bold tabular-nums"
          title="Valor em horas decimais"
        >
          {decimalValue}
        </div>
      )}

      {/* Delete Button */}
      <Button
        onClick={() => onRemove(entry.id)}
        disabled={!canRemove}
        variant="ghost"
        size="icon"
        aria-label="Remover linha"
        className="absolute -top-2 -right-1 h-7 w-7 sm:static sm:h-9 sm:w-9 shrink-0 rounded-full bg-card sm:bg-transparent shadow-[0_0_0_1px_hsl(var(--border))] sm:shadow-none text-muted-foreground hover:text-bad hover:bg-bad-soft"
        data-action="remove-row"
        data-row-index={index}
      >
        <X className="h-4 w-4 stroke-[2.5]" />
      </Button>
    </motion.div>
  );
};

export default TimeRow;
