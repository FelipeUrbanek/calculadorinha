import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft } from "lucide-react";

const DecimalConverter = () => {
  const [decimal, setDecimal] = useState<string>("0.5");
  const [hours, setHours] = useState<string>("0");
  const [minutes, setMinutes] = useState<string>("30");

  const handleDecimalChange = (value: string) => {
    setDecimal(value);
    const decValue = parseFloat(value);
    if (!isNaN(decValue)) {
      const totalMinutes = Math.round(decValue * 60);
      const h = Math.floor(Math.abs(totalMinutes) / 60);
      const m = Math.abs(totalMinutes) % 60;
      setHours(h.toString());
      setMinutes(m.toString().padStart(2, "0"));
    } else {
      setHours("");
      setMinutes("");
    }
  };

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    setHours(newHours);
    setMinutes(newMinutes);

    const h = parseInt(newHours) || 0;
    const m = parseInt(newMinutes) || 0;
    const totalMinutes = h * 60 + m;
    const decValue = totalMinutes / 60;
    setDecimal((Math.round(decValue * 100) / 100).toString());
  };

  return (
    <Card className="shadow-sm border-0 overflow-hidden">
      <CardHeader className="pb-3 bg-purple-600">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          Conversor Rápido
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4 bg-white">
        <div>
          <Label className="text-xs text-slate-500 mb-2 block font-medium">Horas Decimais</Label>
          <Input
            type="number"
            value={decimal}
            onChange={(e) => handleDecimalChange(e.target.value)}
            onFocus={(e) => e.target.select()}
            className="h-14 text-xl font-semibold rounded-xl border-2 border-purple-200 bg-purple-50/50 focus:bg-white focus:border-purple-400 transition-all text-center hover:border-purple-300 hover:shadow-sm"
            placeholder="0.0"
          />
        </div>

        <div className="flex items-center justify-center py-2">
          <div className="bg-purple-600 p-2 rounded-full transition-transform hover:scale-110 hover:rotate-180">
            <ArrowRightLeft className="h-4 w-4 text-white" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Label className="text-xs text-slate-500 mb-2 block font-medium">Horas</Label>
            <Input
              type="number"
              value={hours}
              onChange={(e) => handleTimeChange(e.target.value, minutes)}
              onFocus={(e) => e.target.select()}
              className="h-14 text-xl font-semibold rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-300 transition-all text-center"
              placeholder="0"
            />
          </div>
          <div className="pt-6 text-2xl text-slate-300 font-bold">:</div>
          <div className="flex-1">
            <Label className="text-xs text-slate-500 mb-2 block font-medium">Minutos</Label>
            <Input
              type="number"
              value={minutes}
              onChange={(e) => handleTimeChange(hours, e.target.value)}
              onFocus={(e) => e.target.select()}
              className="h-14 text-xl font-semibold rounded-xl border-2 border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-300 transition-all text-center"
              placeholder="00"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DecimalConverter;
