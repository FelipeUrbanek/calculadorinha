import { useState, useEffect } from "react";
import TimeCalculator, { TimeEntry } from "@/components/TimeCalculator";
import TimeResults from "@/components/TimeResults";
import DecimalConverter from "@/components/DecimalConverter";
import AILawAssistant from "@/components/AILawAssistant";
import { ThemePicker } from "@/components/ThemePicker";

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
    // Recupera os dados do localStorage na inicialização
    const savedEntries = localStorage.getItem(STORAGE_KEYS.TIME_ENTRIES);
    return savedEntries
      ? JSON.parse(savedEntries)
      : [{ id: "1", hours: 0, minutes: 0, operation: "add" }];
  });

  const [showDecimal, setShowDecimal] = useState<boolean>(() => {
    // Recupera a preferência de exibição decimal
    const savedPreference = localStorage.getItem(STORAGE_KEYS.SHOW_DECIMAL);
    return savedPreference ? JSON.parse(savedPreference) : false;
  });

  // Handle preloader
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem("last-visit-date", new Date().toDateString());
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Salva as entradas no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.TIME_ENTRIES,
      JSON.stringify(timeEntries)
    );
  }, [timeEntries]);

  // Salva a preferência de exibição decimal
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.SHOW_DECIMAL,
      JSON.stringify(showDecimal)
    );
  }, [showDecimal]);

  const calculateTotalMinutes = (entries: TimeEntry[]): number => {
    return entries.reduce((total, entry) => {
      const entryMinutes = entry.hours * 60 + entry.minutes;
      return entry.operation === "add"
        ? total + entryMinutes
        : total - entryMinutes;
    }, 0);
  };

  const getAdditionEntries = () =>
    timeEntries.filter((entry) => entry.operation === "add");
  const getSubtractionEntries = () =>
    timeEntries.filter((entry) => entry.operation === "subtract");

  const minutesToTime = (totalMinutes: number) => {
    const isNegative = totalMinutes < 0;
    const absMinutes = Math.abs(totalMinutes);
    const hours = Math.floor(absMinutes / 60);
    const minutes = absMinutes % 60;
    return { hours, minutes, isNegative };
  };
  const minutesToDecimal = (totalMinutes: number): number => {
    // Arredonda para cima e mantém 2 casas decimais
    const decimal = totalMinutes / 60;
    return Math.ceil(decimal * 100) / 100;
  };

  const totalMinutes = calculateTotalMinutes(timeEntries);
  const additionTotal = getAdditionEntries().reduce(
    (total, entry) => total + entry.hours * 60 + entry.minutes,
    0
  );
  const subtractionTotal = getSubtractionEntries().reduce(
    (total, entry) => total + entry.hours * 60 + entry.minutes,
    0
  );

  const finalResult = minutesToTime(totalMinutes);
  const additionResult = minutesToTime(additionTotal);
  const subtractionResult = minutesToTime(subtractionTotal);



  // Preloader
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 border-t-theme-base rounded-full animate-spin mx-auto"></div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-theme-gradient-start to-theme-gradient-end bg-clip-text text-transparent mb-2">
            Calculadorinha
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-sm">Preparando tudo para você...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="page-scroll" className="min-h-screen bg-slate-50 dark:bg-slate-950 fixed inset-0 w-full overflow-y-auto transition-colors duration-300">
      {/* Background Orbs for Glassmorphism */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-theme-base/20 dark:bg-theme-base/10 blur-[100px] mix-blend-multiply dark:mix-blend-screen transition-colors duration-500" />
        <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] rounded-full bg-theme-gradient-end/20 dark:bg-theme-gradient-end/10 blur-[100px] mix-blend-multiply dark:mix-blend-screen transition-colors duration-500" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-theme-gradient-start/20 dark:bg-theme-gradient-start/10 blur-[120px] mix-blend-multiply dark:mix-blend-screen transition-colors duration-500" />
      </div>

      <div className="container mx-auto py-4 sm:py-8 px-4 max-w-7xl relative z-10">
        {/* Header */}
        <header className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-sm rounded-xl px-4 sm:px-6 py-3 sm:py-4 mb-4 sm:mb-8 border border-white/40 dark:border-slate-800/50 transition-colors">
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
              <div className="bg-gradient-to-br from-theme-gradient-start to-theme-gradient-end p-2 sm:p-2.5 rounded-xl shadow-md shrink-0 transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
                <img src="/logo_calculadorinha.svg" alt="Calculadorinha" className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-500" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-theme-gradient-start to-theme-gradient-end bg-clip-text text-transparent truncate pb-0.5 transition-all duration-300 group-hover:opacity-80">
                  Calculadorinha
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate hidden sm:block transition-all duration-300 group-hover:translate-x-1">Calcule suas horas facilmente</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowDecimal(!showDecimal)}
                className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-700/50 backdrop-blur-sm transition-all active:scale-95 border border-white/50 dark:border-slate-700/50 shadow-sm"
              >
                <div className={`w-8 sm:w-10 h-5 sm:h-6 rounded-full transition-all relative shrink-0 ${showDecimal ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                  <div className={`absolute top-1 sm:top-1 w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${showDecimal ? 'translate-x-4 sm:translate-x-5' : 'translate-x-1'}`} />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:inline">Mostrar decimais</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="space-y-12">
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Time Entries */}
            <div className="lg:col-span-2 space-y-6">
              <TimeCalculator 
                timeEntries={timeEntries} 
                setTimeEntries={setTimeEntries} 
                showDecimal={showDecimal}
              />
            </div>

            {/* Right Column: Results, Converter & AI Auditor */}
            <div className="space-y-8">
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
        </div>

        {/* Footer */}
        <footer className="mt-16 pb-8 border-t border-slate-200/60 dark:border-slate-800 pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-gradient-to-br from-theme-gradient-start to-theme-gradient-end p-1.5 rounded-lg shadow-sm">
                  <img src="/logo_calculadorinha.svg" alt="Calculadorinha" className="h-4 w-4" />
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 tracking-tight">Calculadorinha</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm text-center md:text-left">
                Ferramenta simples e eficiente para organizar sua jornada de trabalho e conversões de horas.
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end text-xs text-slate-500 dark:text-slate-400 gap-1 mt-4 md:mt-0">
              <p>
                Desenvolvido com <span className="text-theme-base">♥</span> por{" "}
                <a
                  href="https://felipeurbanek.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-slate-800 dark:text-slate-200 hover:text-theme-base dark:hover:text-theme-base transition-colors underline decoration-slate-300 dark:decoration-slate-700 hover:decoration-theme-base underline-offset-4"
                >
                  Felipe Urbanek
                </a>
              </p>
              <p>© {new Date().getFullYear()} Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>

      <ThemePicker />
      <AILawAssistant />
    </div>
  );
}
