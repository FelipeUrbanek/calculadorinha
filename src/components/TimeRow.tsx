import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, Minus } from "lucide-react";
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
  onFocusNextRow?: (currentIndex: number) => void;
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
  onFocusNextRow,
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

  const toggleOperation = () => {
    const newOperation = entry.operation === "add" ? "subtract" : "add";
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

  const getDecimalHours = (): string => {
    const totalMinutes = entry.hours * 60 + entry.minutes;
    // Arredonda para cima e mantém 2 casas decimais
    const decimal = totalMinutes / 60;
    const roundedUp = Math.ceil(decimal * 100) / 100;
    return roundedUp.toFixed(2);
  };

  const isAddition = entry.operation === "add";
  const bgColor = isAddition
    ? "bg-green-50 border-green-200 hover:border-green-300"
    : "bg-blue-50 border-blue-200 hover:border-blue-300";

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={`grid grid-cols-12 gap-2 sm:gap-4 items-center p-2 sm:p-4 rounded-lg border-2 ${bgColor} transition-colors`}
      data-row-index={index}
    >
      <div className="col-span-4 sm:col-span-2">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="button"
            onClick={toggleOperation}
            className={`w-full ${
              isAddition
                ? "border-green-300 bg-green-100"
                : "border-blue-300 bg-blue-100"
            }`}
            variant="outline"
            data-operation-type={isAddition ? "add" : "subtract"}
          >
            <div className="flex items-center justify-center gap-1 sm:gap-2">
              {isAddition ? (
                <>
                  <Plus className="h-4 w-4 text-green-600" />
                  <span className="text-green-700 hidden sm:inline">Somar</span>
                </>
              ) : (
                <>
                  <Minus className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700 hidden sm:inline">
                    Subtrair
                  </span>
                </>
              )}
            </div>
          </Button>
        </motion.div>
      </div>

      <motion.div
        className="col-span-4 sm:col-span-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Input
          ref={hoursInputRef}
          type="number"
          min="0"
          value={entry.hours.toString()}
          onChange={(e) => handleHoursChange(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, index, "hours")}
          className="text-center text-base sm:text-lg font-semibold px-1 sm:px-3"
          placeholder="0"
          data-input-type="hours"
          data-row-index={index}
        />
      </motion.div>

      <motion.div
        className="col-span-4 sm:col-span-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Input
          ref={minutesInputRef}
          type="number"
          min="0"
          max="59"
          value={entry.minutes.toString()}
          onChange={(e) => handleMinutesChange(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, index, "minutes")}
          className="text-center text-base sm:text-lg font-semibold px-1 sm:px-3"
          placeholder="0"
          data-input-type="minutes"
          data-row-index={index}
        />
      </motion.div>

      {showDecimal && (
        <motion.div
          className="col-span-6 sm:col-span-3 px-2 sm:px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-base sm:text-lg font-semibold text-slate-700 text-center">
            {getDecimalHours()}
          </div>
        </motion.div>
      )}

      <div
        className={`${
          showDecimal ? "col-span-6 sm:col-span-3" : "col-span-12 sm:col-span-6"
        } flex justify-center`}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            onClick={() => onRemove(entry.id)}
            disabled={!canRemove}
            variant="outline"
            size="sm"
            className="text-red-600 hover:bg-red-50 disabled:opacity-30"
            data-action="remove-row"
            data-row-index={index}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TimeRow;
