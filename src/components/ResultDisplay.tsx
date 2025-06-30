import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calculator } from "lucide-react";

interface ResultDisplayProps {
  result: { hours: number; minutes: number; seconds: number };
}

const ResultDisplay = ({ result }: ResultDisplayProps) => {
  const toDecimalHours = (time: {
    hours: number;
    minutes: number;
    seconds: number;
  }): number => {
    return time.hours + time.minutes / 60 + time.seconds / 3600;
  };

  const toDecimalMinutes = (time: {
    hours: number;
    minutes: number;
    seconds: number;
  }): number => {
    return time.hours * 60 + time.minutes + time.seconds / 60;
  };

  const toDecimalSeconds = (time: {
    hours: number;
    minutes: number;
    seconds: number;
  }): number => {
    return time.hours * 3600 + time.minutes * 60 + time.seconds;
  };

  return (
    <div className="space-y-4">
      {/* Main Result */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="text-center pb-3">
          <CardTitle className="flex items-center justify-center gap-2 text-xl text-blue-800">
            <Clock className="h-5 w-5" />
            Resultado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-900 mb-2">
              {String(result.hours).padStart(2, "0")}:
              {String(result.minutes).padStart(2, "0")}:
              {String(result.seconds).padStart(2, "0")}
            </div>
            <div className="text-lg text-blue-700">
              {result.hours}h {result.minutes}m {result.seconds}s
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Decimal Conversions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm font-medium text-emerald-700 mb-1">
                Decimal (Horas)
              </div>
              <div className="text-2xl font-bold text-emerald-800">
                {toDecimalHours(result).toFixed(4)}h
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm font-medium text-orange-700 mb-1">
                Decimal (Minutos)
              </div>
              <div className="text-2xl font-bold text-orange-800">
                {toDecimalMinutes(result).toFixed(2)}m
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm font-medium text-purple-700 mb-1">
                Total (Segundos)
              </div>
              <div className="text-2xl font-bold text-purple-800">
                {toDecimalSeconds(result)}s
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResultDisplay;
