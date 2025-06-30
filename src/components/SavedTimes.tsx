import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Download,
  Archive,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SavedTimesProps {
  savedTimes: { hours: number; minutes: number; seconds: number }[];
  onDelete: (index: number) => void;
  onLoad: (
    time: { hours: number; minutes: number; seconds: number },
    target: "time1" | "time2"
  ) => void;
}

const SavedTimes = ({ savedTimes, onDelete, onLoad }: SavedTimesProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (savedTimes.length === 0) {
    return null;
  }

  const formatTime = (time: {
    hours: number;
    minutes: number;
    seconds: number;
  }) => {
    return `${String(time.hours).padStart(2, "0")}:${String(
      time.minutes
    ).padStart(2, "0")}:${String(time.seconds).padStart(2, "0")}`;
  };

  return (
    <Card className="shadow-lg border-0 bg-white">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-slate-50/50 transition-colors">
            <CardTitle className="flex items-center justify-between text-lg text-slate-800">
              <div className="flex items-center gap-2">
                <Archive className="h-5 w-5 text-slate-600" />
                Tempos Salvos
                <Badge variant="secondary" className="ml-2">
                  {savedTimes.length}
                </Badge>
              </div>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-slate-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-600" />
              )}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {savedTimes.map((time, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-600">
                      #{index + 1}
                    </span>
                    <span className="font-mono text-lg font-semibold text-slate-800">
                      {formatTime(time)}
                    </span>
                    <span className="text-sm text-slate-600">
                      ({time.hours}h {time.minutes}m {time.seconds}s)
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onLoad(time, "time1")}
                      className="text-xs border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Tempo 1
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onLoad(time, "time2")}
                      className="text-xs border-green-300 text-green-700 hover:bg-green-50"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Tempo 2
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(index)}
                      className="text-xs border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default SavedTimes;
