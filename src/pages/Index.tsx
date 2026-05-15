import { useState, useEffect } from "react";
import TimeCalculator, { TimeEntry } from "@/components/TimeCalculator";
import TimeResults from "@/components/TimeResults";
import DecimalConverter from "@/components/DecimalConverter";
import AILawAssistant from "@/components/AILawAssistant";
import { ThemePicker } from "@/components/ThemePicker";
import PiPCalculator from "@/components/PiPCalculator";

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
    return (
      <div className="fixed inset-0 bg-white dark:bg-slate-950 flex items-center justify-center z-[9999]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 border-t-theme-base rounded-full animate-spin mx-auto mb-8 shadow-xl shadow-theme-base/20"></div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-theme-gradient-start to-theme-gradient-end bg-clip-text text-transparent tracking-tighter">Calculadorinha</h1>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-4 font-medium uppercase tracking-[0.3em]">Preparando sua jornada</p>
        </div>
      </div>
    );
  }

  return (
    <div id="page-scroll" className="min-h-screen bg-slate-50 dark:bg-slate-950 fixed inset-0 w-full overflow-y-auto transition-colors duration-300 custom-scrollbar selection:bg-theme-base/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(var(--theme-base-rgb),0.05),transparent_40%)]" />
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-theme-base/10 dark:bg-theme-base/5 blur-[100px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] rounded-full bg-theme-gradient-end/10 dark:bg-theme-gradient-end/5 blur-[100px]" />
      </div>

      <div className="container mx-auto py-8 px-6 max-w-7xl relative z-10">
        {/* Header */}
        <header className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] rounded-3xl px-8 py-5 mb-12 border border-white/40 dark:border-slate-800/50 transition-all flex justify-between items-center">
          <div className="flex items-center gap-5 group cursor-pointer">
            <div className="bg-gradient-to-br from-theme-gradient-start to-theme-gradient-end p-3 rounded-2xl shadow-xl shadow-theme-base/20 transition-transform duration-700 group-hover:rotate-[360deg]">
              <img src="/logo_calculadorinha.svg" alt="Calculadorinha" className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl font-black bg-gradient-to-r from-theme-gradient-start to-theme-gradient-end bg-clip-text text-transparent tracking-tighter">
                Calculadorinha
              </h1>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest opacity-60">Hora Certa & Multitools</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowDecimal(!showDecimal)}
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-md transition-all active:scale-95 border shadow-sm font-bold text-xs uppercase tracking-wider ${
                showDecimal 
                ? 'bg-theme-base/10 border-theme-base/30 text-theme-base' 
                : 'bg-white/50 dark:bg-slate-800/50 border-white/50 dark:border-slate-700/50 text-slate-500'
              }`}
            >
              <div className={`w-10 h-5 rounded-full transition-all relative shrink-0 ${showDecimal ? 'bg-theme-base' : 'bg-slate-300 dark:bg-slate-600'}`}>
                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm transition-all duration-300 ${showDecimal ? 'translate-x-6' : 'translate-x-1'}`} />
              </div>
              <span className="hidden sm:inline">Modo Decimal</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <TimeCalculator timeEntries={timeEntries} setTimeEntries={setTimeEntries} showDecimal={showDecimal} />
          </div>

          <div className="space-y-10">
            <TimeResults
              finalResult={finalResult}
              additionResult={additionResult}
              subtractionResult={subtractionResult}
              showDecimal={showDecimal}
              finalDecimal={minutesToDecimal(totalMinutes)}
              additionDecimal={minutesToDecimal(additionTotal)}
              subtractionDecimal={minutesToDecimal(subtractionTotal)}
            />
            <DecimalConverter />
          </div>
        </main>

        <footer className="mt-24 pb-12 border-t border-slate-200 dark:border-slate-800/50 pt-16 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-br from-theme-gradient-start to-theme-gradient-end p-2 rounded-xl">
                <img src="/logo_calculadorinha.svg" alt="Calculadorinha" className="h-5 w-5" />
              </div>
              <span className="font-black text-xl text-slate-800 dark:text-white tracking-tight">Calculadorinha</span>
            </div>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 max-w-sm text-center md:text-left leading-relaxed">
              Organize sua jornada de trabalho com precisão e estética impecável.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end text-[13px] text-slate-500 dark:text-slate-400 gap-2">
            <p>Criado com <span className="text-theme-base animate-pulse">♥</span> por <a href="https://felipeurbanek.com" className="font-bold text-slate-800 dark:text-white hover:text-theme-base transition-colors underline decoration-theme-base/30 underline-offset-4">Felipe Urbanek</a></p>
            <p>© {new Date().getFullYear()} • Impeccable Design</p>
          </div>
        </footer>
      </div>

      {/* Floating Controls Area - REFINED STACK */}
      <div className="fixed bottom-10 right-10 z-[9999] flex flex-col gap-8 items-end animate-in fade-in slide-in-from-right-10 duration-1000">
        <AILawAssistant />
        <PiPCalculator />
        <ThemePicker />
      </div>
    </div>
  );
}
