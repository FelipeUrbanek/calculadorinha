import { Input } from "@/components/ui/input";
import { Clock } from "lucide-react";

// Removendo a importação não utilizada de TimeValue

interface TimeInputProps {
  value: { hours: number; minutes: number; seconds: number };
  onChange: (value: { hours: number; minutes: number; seconds: number }) => void;
}

const TimeInput = ({ value, onChange }: TimeInputProps) => {
  const handleChange = (field: keyof { hours: number; minutes: number; seconds: number }, inputValue: string) => {
    const numValue = Math.max(0, parseInt(inputValue) || 0);
    onChange({ ...value, [field]: numValue });
  };

  return (
    <div className="flex items-center gap-2 p-4 rounded-lg border-2 border-slate-200 bg-white/50 hover:border-blue-300 transition-colors">
      <Clock className="h-5 w-5 text-blue-600 flex-shrink-0" />
      
      <div className="flex items-center gap-1 flex-1">
        <Input
          type="number"
          min="0"
          value={value.hours.toString()}
          onChange={(e) => handleChange("hours", e.target.value)}
          className="text-center border-0 bg-transparent text-lg font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 w-16"
          placeholder="0"
        />
        <span className="text-slate-600 font-medium">h</span>
      </div>

      <div className="flex items-center gap-1">
        <Input
          type="number"
          min="0"
          max="59"
          value={value.minutes.toString()}
          onChange={(e) => handleChange("minutes", e.target.value)}
          className="text-center border-0 bg-transparent text-lg font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 w-16"
          placeholder="0"
        />
        <span className="text-slate-600 font-medium">m</span>
      </div>

      <div className="flex items-center gap-1">
        <Input
          type="number"
          min="0"
          max="59"
          value={value.seconds.toString()}
          onChange={(e) => handleChange("seconds", e.target.value)}
          className="text-center border-0 bg-transparent text-lg font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 w-16"
          placeholder="0"
        />
        <span className="text-slate-600 font-medium">s</span>
      </div>
    </div>
  );
};

export default TimeInput;
