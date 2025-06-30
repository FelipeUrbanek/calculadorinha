import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus, Calculator } from "lucide-react";

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

const formatDecimal = (value: number) => {
  const absValue = Math.abs(value);
  const hours = Math.floor(absValue);
  const minutes = Math.round((absValue - hours) * 60);

  if (minutes === 0) {
    return `${value < 0 ? "-" : ""}${hours}h`;
  }

  return `${value < 0 ? "-" : ""}${hours}h ${minutes}m`;
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Final Result */}
      <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200 shadow-lg sm:col-span-2 lg:col-span-1 order-first">
        <CardHeader className="text-center pb-2 sm:pb-3">
          <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl text-purple-800">
            <Calculator className="h-5 w-5" />
            Resultado Final
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="text-center">
            <div
              className={`text-3xl sm:text-4xl font-bold mb-1 sm:mb-2 ${
                finalResult.isNegative ? "text-red-700" : "text-purple-900"
              }`}
            >
              {formatTime(finalResult)}
            </div>
            <div
              className={`text-base sm:text-lg ${
                finalResult.isNegative ? "text-red-600" : "text-purple-700"
              }`}
            >
              {finalResult.isNegative ? "-" : ""}
              {formatDecimal(finalDecimal)}
            </div>
          </div>

          {showDecimal && (
            <div className="bg-white/50 rounded-lg p-3 sm:p-4 text-center">
              <div className="text-sm font-medium text-purple-700 mb-1">
                Decimal
              </div>
              <div
                className={`text-xl sm:text-2xl font-bold ${
                  finalResult.isNegative ? "text-red-700" : "text-purple-800"
                }`}
              >
                {finalDecimal.toFixed(2)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Addition Results */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
        <CardHeader className="text-center pb-2 sm:pb-3">
          <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl text-green-800">
            <Plus className="h-5 w-5" />
            Total Somado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-green-900 mb-1 sm:mb-2">
              {formatTime(additionResult)}
            </div>
            <div className="text-base sm:text-lg text-green-700">
              {formatDecimal(additionDecimal)}
            </div>
          </div>

          {showDecimal && (
            <div className="bg-white/50 rounded-lg p-3 sm:p-4 text-center">
              <div className="text-sm font-medium text-green-700 mb-1">
                Decimal
              </div>
              <div className="text-xl sm:text-2xl font-bold text-green-800">
                {additionDecimal.toFixed(2)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subtraction Results */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
        <CardHeader className="text-center pb-2 sm:pb-3">
          <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl text-blue-800">
            <Minus className="h-5 w-5" />
            Total Subtraído
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-blue-900 mb-1 sm:mb-2">
              {formatTime(subtractionResult)}
            </div>
            <div className="text-base sm:text-lg text-blue-700">
              {formatDecimal(subtractionDecimal)}
            </div>
          </div>

          {showDecimal && (
            <div className="bg-white/50 rounded-lg p-3 sm:p-4 text-center">
              <div className="text-sm font-medium text-blue-700 mb-1">
                Decimal
              </div>
              <div className="text-xl sm:text-2xl font-bold text-blue-800">
                {subtractionDecimal.toFixed(2)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeResults;
