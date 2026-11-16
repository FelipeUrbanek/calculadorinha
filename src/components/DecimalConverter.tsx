import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, X, Plus } from "lucide-react";
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

  const fieldClass =
    "h-14 rounded-2xl border-0 bg-background text-2xl font-bold tabular-nums text-foreground text-center shadow-none focus-visible:ring-2 focus-visible:ring-theme-base focus-visible:ring-offset-0 md:text-2xl";

  return (
    <Card className="rounded-[26px] border-0 bg-card shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 stroke-[2.5] text-theme-base" />
          Conversor rápido
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-5">
          {converters.map((row) => (
            <div key={row.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground font-semibold">
                  Horas decimais
                </Label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeConverter(row.id)}
                  aria-label="Remover conversão"
                  className="h-8 w-8 text-muted-foreground hover:text-bad hover:bg-bad-soft rounded-full transition-colors"
                >
                  <X className="h-4 w-4 stroke-[2.5]" />
                </Button>
              </div>
              <Input
                type="number"
                value={row.decimal}
                onChange={(e) => updateFromDecimal(row.id, e.target.value)}
                onFocus={(e) => e.target.select()}
                className={fieldClass}
                placeholder="0.0"
              />

              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label className="text-sm text-muted-foreground mb-1.5 block font-semibold">
                    Horas
                  </Label>
                  <Input
                    type="number"
                    value={row.hours}
                    onChange={(e) =>
                      updateFromTime(row.id, e.target.value, row.minutes)
                    }
                    onFocus={(e) => e.target.select()}
                    className={fieldClass}
                    placeholder="0"
                  />
                </div>
                <div className="pt-7 text-2xl text-muted-foreground/60 font-bold">:</div>
                <div className="flex-1">
                  <Label className="text-sm text-muted-foreground mb-1.5 block font-semibold">
                    Minutos
                  </Label>
                  <Input
                    type="number"
                    value={row.minutes}
                    onChange={(e) =>
                      updateFromTime(row.id, row.hours, e.target.value)
                    }
                    onFocus={(e) => e.target.select()}
                    className={fieldClass}
                    placeholder="00"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button
          onClick={addConverter}
          variant="ghost"
          className="w-full h-12 rounded-full font-bold bg-theme-base/10 text-theme-base hover:bg-theme-base hover:text-white dark:bg-theme-base/20 dark:text-foreground dark:hover:bg-theme-base active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5 mr-1 stroke-[2.5]" />
          Adicionar conversão
        </Button>
      </CardContent>
    </Card>
  );
};

export default DecimalConverter;
