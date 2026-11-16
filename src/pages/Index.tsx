import { useState, useEffect } from "react";
import TimeCalculator, { TimeEntry } from "@/components/TimeCalculator";
import TimeResults from "@/components/TimeResults";
import DecimalConverter from "@/components/DecimalConverter";
import { ThemePicker } from "@/components/ThemePicker";
import Logo from "@/components/Logo";
import Preloader from "@/components/Preloader";

// Chaves para o localStorage
const STORAGE_KEYS = {
  TIME_ENTRIES: "hora-certa-entries",
  SHOW_DECIMAL: "hora-certa-show-decimal",
};

export default function Index() {
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    const lastVisit = localStorage.getItem("last-visit-date");
    const today = new Date().toDateString();
    return lastVisit !== today;
  });

  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => {
    const savedEntries = localStorage.getItem(STORAGE_KEYS.TIME_ENTRIES);
    return savedEntries
      ? JSON.parse(savedEntries)
      : [{ id: "1", hours: 0, minutes: 0, operation: "add" }];
  });

  const [showDecimal, setShowDecimal] = useState<boolean>(() => {
    const savedPreference = localStorage.getItem(STORAGE_KEYS.SHOW_DECIMAL);
    return savedPreference ? JSON.parse(savedPreference) : false;
  });

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem("last-visit-date", new Date().toDateString());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIME_ENTRIES, JSON.stringify(timeEntries));
  }, [timeEntries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHOW_DECIMAL, JSON.stringify(showDecimal));
  }, [showDecimal]);

  const calculateTotalMinutes = (entries: TimeEntry[]): number => {
    return entries.reduce((total, entry) => {
      const entryMinutes = entry.hours * 60 + entry.minutes;
      return entry.operation === "add" ? total + entryMinutes : total - entryMinutes;
    }, 0);
  };

  const minutesToTime = (totalMinutes: number) => {
    const isNegative = totalMinutes < 0;
    const absMinutes = Math.abs(totalMinutes);
    const hours = Math.floor(absMinutes / 60);
    const minutes = absMinutes % 60;
    return { hours, minutes, isNegative };
  };

  const minutesToDecimal = (totalMinutes: number): number => {
    const decimal = totalMinutes / 60;
    return Math.ceil(decimal * 100) / 100;
  };

  const totalMinutes = calculateTotalMinutes(timeEntries);
  const additionTotal = timeEntries.filter(e => e.operation === "add").reduce((t, e) => t + e.hours * 60 + e.minutes, 0);
  const subtractionTotal = timeEntries.filter(e => e.operation === "subtract").reduce((t, e) => t + e.hours * 60 + e.minutes, 0);

  const finalResult = minutesToTime(totalMinutes);
  const additionResult = minutesToTime(additionTotal);
  const subtractionResult = minutesToTime(subtractionTotal);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <div id="page-scroll" className="min-h-screen bg-background text-foreground fixed inset-0 w-full overflow-y-auto transition-colors duration-300 selection:bg-theme-base/30">
      <div className="container mx-auto py-6 px-4 sm:px-6 max-w-7xl">
        {/* Header */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Logo className="h-12 w-12 shrink-0" />
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-[26px] font-extrabold leading-none tracking-tight text-foreground">
                Calculadorinha
              </h1>
              <p className="text-[13px] text-muted-foreground mt-1">Hora certa e multitools</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDecimal(!showDecimal)}
              role="switch"
              aria-checked={showDecimal}
              className="flex items-center gap-2.5 h-11 pl-3 pr-4 rounded-full bg-card text-sm font-semibold text-foreground transition-colors active:scale-95"
            >
              <span className={`w-[38px] h-[22px] rounded-full relative shrink-0 transition-colors ${showDecimal ? 'bg-theme-base' : 'bg-border'}`}>
                <span className={`absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${showDecimal ? 'translate-x-4' : 'translate-x-0'}`} />
              </span>
              <span className="hidden sm:inline">Modo decimal</span>
            </button>
            <ThemePicker />
          </div>
        </header>

        {/* No celular o resultado fica preso no topo; no computador a coluna da direita acompanha a rolagem. */}
        <main className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-4 lg:gap-5 items-start">
          <div>
            <TimeCalculator timeEntries={timeEntries} setTimeEntries={setTimeEntries} showDecimal={showDecimal} />
          </div>

          <div className="max-lg:contents lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto lg:space-y-3 [scrollbar-width:none]">
            <div className="max-lg:sticky max-lg:top-2 max-lg:z-20 max-lg:order-first">
              <TimeResults
                finalResult={finalResult}
                additionResult={additionResult}
                subtractionResult={subtractionResult}
                showDecimal={showDecimal}
                finalDecimal={minutesToDecimal(totalMinutes)}
                additionDecimal={minutesToDecimal(additionTotal)}
                subtractionDecimal={minutesToDecimal(subtractionTotal)}
              />
            </div>
            <DecimalConverter />
          </div>
        </main>

        <footer className="mt-16 pb-8 border-t border-border pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-2">
              <Logo className="h-9 w-9" />
              <span className="font-extrabold text-xl text-foreground tracking-tight">Calculadorinha</span>
            </div>
            <p className="text-[13px] text-muted-foreground max-w-sm text-center md:text-left leading-relaxed">
              Organize sua jornada de trabalho com precisão.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end text-[13px] text-muted-foreground gap-1.5">
            <p>Criado com <span className="text-theme-base">♥</span> por <a href="https://felipeurbanek.com" className="font-bold text-foreground hover:text-theme-base transition-colors underline decoration-theme-base/30 underline-offset-4">Felipe Urbanek</a></p>
            <p>© {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
