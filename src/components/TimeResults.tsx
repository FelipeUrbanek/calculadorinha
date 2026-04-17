import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface TimeResultsProps {
  finalResult: { hours: number; minutes: number; isNegative: boolean };
  additionResult: { hours: number; minutes: number; isNegative: boolean };
  subtractionResult: { hours: number; minutes: number; isNegative: boolean };
  finalDecimal: number;
  additionDecimal: number;
  subtractionDecimal: number;
  showDecimal: boolean;
}

const formatTime = (result: {
  hours: number;
  minutes: number;
  isNegative: boolean;
}) => {
  const sign = result.isNegative ? "-" : "";
  const hours = result.hours.toString().padStart(2, "0");
  const minutes = result.minutes.toString().padStart(2, "0");
  return `${sign}${hours}:${minutes}`;
};

const TimeResults = ({
  finalResult,
  additionResult,
  subtractionResult,
  finalDecimal,
  additionDecimal,
  subtractionDecimal,
  showDecimal,
}: TimeResultsProps) => {
  return (
    <Card className="shadow-xl shadow-theme-base/5 bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl border-white/40 dark:border-slate-800/50 overflow-hidden relative transition-all duration-500 hover:shadow-2xl hover:shadow-theme-base/20 group">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-theme-gradient-start via-purple-500 to-theme-gradient-end"></div>
      <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800/50">
        <CardTitle className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></div>
          Resultado Final
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Result */}
        <div className="text-center py-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 relative overflow-hidden group transition-colors">
          <div className="absolute inset-0 bg-gradient-to-br from-theme-gradient-start/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative text-7xl font-black text-slate-800 dark:text-white tracking-tighter drop-shadow-sm transition-colors">
            {formatTime(finalResult)}
          </div>
          {showDecimal && (
            <div className="relative mt-4 inline-block bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-colors">
              {finalDecimal.toFixed(2)} horas decimais
            </div>
          )}
        </div>

        <Separator />

        {/* Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col justify-center p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20 transition-all duration-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:-translate-y-1 hover:shadow-md cursor-default">
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-1">Total Somado</span>
            <div className="font-bold text-emerald-900 dark:text-white text-xl">
              {formatTime(additionResult)}
            </div>
            {showDecimal && (
              <div className="text-[10px] text-emerald-600 dark:text-emerald-500/70 mt-1 font-medium select-none">
                {additionDecimal.toFixed(2)} dec
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center p-4 bg-rose-50 dark:bg-rose-500/10 rounded-xl border border-rose-100 dark:border-rose-500/20 transition-all duration-300 hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:-translate-y-1 hover:shadow-md cursor-default">
            <span className="text-rose-700 dark:text-rose-400 font-semibold text-xs uppercase tracking-wider mb-1">Total Subtraído</span>
            <div className="font-bold text-rose-900 dark:text-white text-xl">
              {formatTime(subtractionResult)}
            </div>
            {showDecimal && (
              <div className="text-[10px] text-rose-600 dark:text-rose-500/70 mt-1 font-medium select-none">
                {subtractionDecimal.toFixed(2)} dec
              </div>
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default TimeResults;
