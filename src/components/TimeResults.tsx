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
    <Card className="shadow-sm border-0 bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-slate-900">
          Resultado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Result */}
        <div className="text-center py-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl">
          <div className="text-6xl font-bold text-slate-900 tracking-tight">
            {formatTime(finalResult)}
          </div>
          {showDecimal && (
            <div className="mt-3 inline-block bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-medium">
              {finalDecimal.toFixed(2)} horas decimais
            </div>
          )}
        </div>

        <Separator />

        {/* Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100 transition-all hover:shadow-md hover:scale-[1.02]">
            <span className="text-green-700 font-medium text-sm">Total Somado</span>
            <div className="text-right">
              <div className="font-bold text-green-900">
                {formatTime(additionResult)}
              </div>
              {showDecimal && (
                <div className="text-xs text-green-600 mt-0.5">
                  {additionDecimal.toFixed(2)} decimais
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100 transition-all hover:shadow-md hover:scale-[1.02]">
            <span className="text-red-700 font-medium text-sm">Total Subtraído</span>
            <div className="text-right">
              <div className="font-bold text-red-900">
                {formatTime(subtractionResult)}
              </div>
              {showDecimal && (
                <div className="text-xs text-red-600 mt-0.5">
                  {subtractionDecimal.toFixed(2)} decimais
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeResults;
