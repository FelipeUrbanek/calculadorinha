import { AnimatedTime } from "./AnimatedTime";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

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
  const { toast } = useToast();

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Texto copiado",
      duration: 2000,
    });
  };

  const copyOnKey = (e: React.KeyboardEvent, value: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCopy(value);
    }
  };

  const finalText = formatTime(finalResult);
  const additionText = formatTime(additionResult);
  const subtractionText = formatTime(subtractionResult);

  return (
    <div className="space-y-3">
      {/* Total: o único bloco grande e colorido da tela */}
      <div
        onClick={() => handleCopy(finalText)}
        onKeyDown={(e) => copyOnKey(e, finalText)}
        role="button"
        tabIndex={0}
        aria-label={`Saldo do dia ${finalText}. Clique para copiar`}
        className="relative cursor-pointer select-none rounded-[38px] bg-theme-base px-6 pb-6 pt-5 text-white transition-transform active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-theme-base/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        title="Clique para copiar"
      >
        <div className="flex items-center justify-between gap-3 text-sm font-semibold">
          <span className="opacity-85">Saldo do dia</span>
          <span className="flex items-center gap-1.5 opacity-75">
            <Copy className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Toque para copiar</span>
          </span>
        </div>
        <div
          aria-live="polite"
          className="mt-1 text-[64px] sm:text-[76px] xl:text-[104px] 2xl:text-[116px] font-extrabold leading-[0.95] tracking-[-0.05em]"
        >
          <AnimatedTime value={finalText} className="justify-start" />
        </div>
        {showDecimal && (
          <div className="mt-3 inline-block rounded-full bg-warn px-3.5 py-1.5 text-sm font-bold text-[#3A2500]">
            {finalDecimal.toFixed(2).replace(".", ",")} horas decimais
          </div>
        )}
      </div>

      {/* Somado e subtraído */}
      <div className="grid grid-cols-2 gap-3 max-lg:hidden">
        <div
          onClick={() => handleCopy(additionText)}
          onKeyDown={(e) => copyOnKey(e, additionText)}
          role="button"
          tabIndex={0}
          aria-label={`Total somado ${additionText}. Clique para copiar`}
          className="cursor-pointer rounded-3xl bg-ok-soft px-[18px] py-3.5 text-ok transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ok"
          title="Clique para copiar"
        >
          <span className="block text-sm font-semibold">Somado</span>
          <div className="text-[28px] font-bold tracking-tight">
            <AnimatedTime value={additionText} className="justify-start" />
          </div>
          {showDecimal && (
            <div className="mt-0.5 text-xs font-semibold tabular-nums opacity-80">
              {additionDecimal.toFixed(2).replace(".", ",")} dec
            </div>
          )}
        </div>
        <div
          onClick={() => handleCopy(subtractionText)}
          onKeyDown={(e) => copyOnKey(e, subtractionText)}
          role="button"
          tabIndex={0}
          aria-label={`Total subtraído ${subtractionText}. Clique para copiar`}
          className="cursor-pointer rounded-3xl bg-bad-soft px-[18px] py-3.5 text-bad transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bad"
          title="Clique para copiar"
        >
          <span className="block text-sm font-semibold">Subtraído</span>
          <div className="text-[28px] font-bold tracking-tight">
            <AnimatedTime value={subtractionText} className="justify-start" />
          </div>
          {showDecimal && (
            <div className="mt-0.5 text-xs font-semibold tabular-nums opacity-80">
              {subtractionDecimal.toFixed(2).replace(".", ",")} dec
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeResults;
