import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type ConverterRow = {
  id: string;
  decimal: string;
  hours: string;
  minutes: string;
};

const DecimalConverter = () => {
  const [converters, setConverters] = useState<ConverterRow[]>([
    { id: Date.now().toString(), decimal: "0.5", hours: "0", minutes: "30" },
  ]);

  const updateFromDecimal = (id: string, value: string) => {
    setConverters((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const decValue = parseFloat(value);
        if (isNaN(decValue)) {
          return { ...row, decimal: value, hours: "", minutes: "" };
        }
        const totalMinutes = Math.round(decValue * 60);
        const h = Math.floor(Math.abs(totalMinutes) / 60);
        const m = Math.abs(totalMinutes) % 60;
        return {
          ...row,
          decimal: value,
          hours: h.toString(),
          minutes: m.toString().padStart(2, "0"),
        };
      })
    );
  };

  const updateFromTime = (id: string, newHours: string, newMinutes: string) => {
    setConverters((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const h = parseInt(newHours) || 0;
        const m = parseInt(newMinutes) || 0;
        const totalMinutes = h * 60 + m;
        const decValue = totalMinutes / 60;
        return {
          ...row,
          hours: newHours,
          minutes: newMinutes,
          decimal: (Math.round(decValue * 100) / 100).toString(),
        };
      })
    );
  };

  const addConverter = () => {
    const newId = (Date.now() + Math.random()).toString();
    setConverters((prev) => [
      ...prev,
      { id: newId, decimal: "0.0", hours: "0", minutes: "00" },
    ]);
  };

  const removeConverter = (id: string) => {
    setConverters((prev) =>
      prev.length > 1 ? prev.filter((row) => row.id !== id) : prev
    );
  };

  return (
    <Card className="shadow-xl shadow-theme-base/5 border-white/40 dark:border-slate-800/50 overflow-hidden bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-theme-base/10 group">
      <CardHeader className="pb-3 bg-theme-base transition-colors duration-500">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          Conversor Rápido
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4 bg-transparent transition-colors">
        <div className="space-y-6">
          {converters.map((row) => (
            <div key={row.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Horas Decimais
                </Label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeConverter(row.id)}
                  className="text-slate-400 hover:text-theme-base hover:bg-theme-base/10 dark:hover:bg-theme-base/10 rounded-full transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Input
                type="number"
                value={row.decimal}
                onChange={(e) => updateFromDecimal(row.id, e.target.value)}
                onFocus={(e) => e.target.select()}
                className="h-14 text-xl font-semibold rounded-xl border-2 border-theme-base/20 dark:border-theme-base/30 bg-theme-base/5 dark:bg-theme-base/10 focus:bg-white dark:focus:bg-slate-900 focus:border-theme-base/60 dark:focus:border-theme-base/50 transition-all text-center hover:border-theme-base/40 dark:hover:border-theme-base/40 hover:shadow-sm text-slate-800 dark:text-white"
                placeholder="0.0"
              />

              <div className="flex items-center justify-center py-2">
                <div className="bg-theme-base p-2 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-180">
                  <ArrowRightLeft className="h-4 w-4 text-white" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block font-medium">
                    Horas
                  </Label>
                  <Input
                    type="number"
                    value={row.hours}
                    onChange={(e) =>
                      updateFromTime(row.id, e.target.value, row.minutes)
                    }
                    onFocus={(e) => e.target.select()}
                    className="h-14 text-xl font-semibold rounded-xl border-2 border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm focus:bg-white dark:focus:bg-slate-900 focus:border-slate-300 dark:focus:border-slate-600 transition-all text-center text-slate-800 dark:text-white"
                    placeholder="0"
                  />
                </div>
                <div className="pt-6 text-2xl text-slate-300 dark:text-slate-700 font-bold">:</div>
                <div className="flex-1">
                  <Label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block font-medium">
                    Minutos
                  </Label>
                  <Input
                    type="number"
                    value={row.minutes}
                    onChange={(e) =>
                      updateFromTime(row.id, row.hours, e.target.value)
                    }
                    onFocus={(e) => e.target.select()}
                    className="h-14 text-xl font-semibold rounded-xl border-2 border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm focus:bg-white dark:focus:bg-slate-900 focus:border-slate-300 dark:focus:border-slate-600 transition-all text-center text-slate-800 dark:text-white"
                    placeholder="00"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-2">
          <Button
            onClick={addConverter}
            className="w-full bg-slate-600 hover:bg-slate-700 text-white h-11 font-medium transition-all hover:scale-105 active:scale-95"
          >
            Adicionar conversão
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DecimalConverter;
