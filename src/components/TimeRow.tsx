import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus } from "lucide-react";
import { Label } from "@/components/ui/label";
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
  const bgColor = isAddition ? "bg-green-50/50" : "bg-red-50/50";
  const borderColor = isAddition ? "border-green-100" : "border-red-100";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-wrap sm:flex-nowrap items-center gap-4 py-3 px-4 rounded-xl border ${bgColor} ${borderColor} transition-colors`}
      data-row-index={index}
    >
      {/* Operation Toggle */}
      <div className="flex items-center gap-2 min-w-[140px]">
        <button
          onClick={() => toggleOperation(!isAddition)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all shadow-sm hover:scale-105 active:scale-95 ${
            isAddition
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          {isAddition ? (
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
          ) : (
            <Minus className="h-4 w-4" />
          )}
          {isAddition ? "Somar" : "Subtrair"}
        </button>
      </div>

      {/* Hours Input */}
      <div className="flex-1 min-w-[100px]">
        <Label className="text-xs text-slate-500 mb-1 block">Horas</Label>
        <Input
          ref={hoursInputRef}
          type="number"
          min="0"
          value={entry.hours.toString()}
          onChange={(e) => handleHoursChange(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, index, "hours")}
          onFocus={(e) => e.target.select()}
          className="h-12 text-lg rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-slate-200 transition-all text-center hover:border-slate-300"
          placeholder="0"
          data-input-type="hours"
          data-row-index={index}
        />
      </div>

      {/* Minutes Input */}
      <div className="flex-1 min-w-[100px]">
        <Label className="text-xs text-slate-500 mb-1 block">Minutos</Label>
        <Input
          ref={minutesInputRef}
          type="number"
          min="0"
          max="59"
          value={entry.minutes.toString().padStart(2, "0")}
          onChange={(e) => handleMinutesChange(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, index, "minutes")}
          onFocus={(e) => e.target.select()}
          className="h-12 text-lg rounded-xl border-slate-200 bg-white focus:ring-2 focus:ring-slate-200 transition-all text-center hover:border-slate-300"
          placeholder="00"
          data-input-type="minutes"
          data-row-index={index}
        />
      </div>

      {/* Decimal Display */}
      {showDecimal && (
        <div className="flex-1 min-w-[100px]">
          <Label className="text-xs text-slate-500 mb-1 block">Decimal</Label>
          <div className="h-12 flex items-center justify-center px-3 text-lg font-medium text-slate-600 bg-slate-50 rounded-xl border border-transparent transition-all hover:bg-slate-100">
            {(
              entry.hours +
              Math.ceil((entry.minutes / 60) * 100) / 100
            ).toFixed(2)}
          </div>
        </div>
      )}

      {/* Delete Button */}
      <div className="pt-5">
        <Button
          onClick={() => onRemove(entry.id)}
          disabled={!canRemove}
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all hover:scale-110 active:scale-90"
          data-action="remove-row"
          data-row-index={index}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default TimeRow;
